
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const receptionistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  appointmentsHandled: z.coerce.number().min(0, 'Must be a positive number'),
  incomingCalls: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addReceptionist(prevState: any, formData: FormData) {
  const validatedFields = receptionistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Receptionist.',
    };
  }

  const { name, email, ...receptionistData } = validatedFields.data;

  try {
    const userRef = adminDb.collection('users').doc(); 
    const uid = userRef.id;

    await userRef.set({
      uid,
      fullName: name,
      email,
      role: 'receptionist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('receptionists').doc(uid).set({
      ...receptionistData,
      name,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/admin/receptionists');
    return { type: 'success', message: `Added receptionist ${name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Create Receptionist.' };
  }
}

export async function updateReceptionist(id: string, prevState: any, formData: FormData) {
  const validatedFields = receptionistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Receptionist.',
    };
  }
  const { name, email, ...receptionistData } = validatedFields.data;

  try {
    await adminDb.collection('receptionists').doc(id).update(receptionistData);

    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/receptionists');
    return { type: 'success', message: `Updated receptionist ${name}` };
  } catch (error) {
    console.error("Error updating receptionist:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Receptionist.' };
  }
}

export async function deleteReceptionist(id: string) {
    try {
        await adminDb.collection('receptionists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/receptionists');
        return { type: 'success', message: 'Receptionist profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting receptionist:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Receptionist.' };
    }
}
