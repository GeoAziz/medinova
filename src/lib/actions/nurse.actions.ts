
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const nurseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ward: z.string().min(1, 'Ward is required'),
  shift: z.string().min(1, 'Shift is required'),
  status: z.string().min(1, 'Status is required'),
});

export async function addNurse(prevState: any, formData: FormData) {
  const validatedFields = nurseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Nurse.',
    };
  }
  
  const { name, ward, shift, status } = validatedFields.data;

  try {
    // In a real app, you would create the user in Auth first and use their UID
    const docRef = await adminDb.collection('nurses').add({
      name,
      ward,
      shift,
      status,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // This is a simplified approach. A full implementation would link this to a user in /users.
    console.log("Created a nurse profile with ID: ", docRef.id);


    revalidatePath('/admin/nurses');
    return { type: 'success', message: `Added nurse ${name}` };
  } catch (error) {
    console.error(error)
    return { type: 'error', message: 'Database Error: Failed to Create Nurse.' };
  }
}

export async function updateNurse(id: string, prevState: any, formData: FormData) {
  const validatedFields = nurseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Nurse.',
    };
  }

  try {
    const { name, ward, shift, status } = validatedFields.data;
    await adminDb.collection('nurses').doc(id).update({ ward, shift, status });
    
    // Also update the fullName in the corresponding /users document
    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/nurses');
    return { type: 'success', message: `Updated nurse ${name}` };
  } catch (error) {
    console.error("Error updating nurse:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Nurse.' };
  }
}

export async function deleteNurse(id: string) {
    try {
        await adminDb.collection('nurses').doc(id).delete();
        // You would also delete or disable the user in the /users collection and Auth
        // await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/nurses');
        return { type: 'success', message: 'Nurse profile deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Nurse.' };
    }
}
