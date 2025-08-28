
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const nurseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
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
  
  const { name, email, ...nurseData } = validatedFields.data;

  try {
    const userRef = adminDb.collection('users').doc();
    const uid = userRef.id;

    await userRef.set({
      uid,
      fullName: name,
      email,
      role: 'nurse',
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    await adminDb.collection('nurses').doc(uid).set({
      ...nurseData,
      name,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

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
    const { name, email, ...nurseData } = validatedFields.data;
    await adminDb.collection('nurses').doc(id).update(nurseData);
    
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
        await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/nurses');
        return { type: 'success', message: 'Nurse profile deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Nurse.' };
    }
}
