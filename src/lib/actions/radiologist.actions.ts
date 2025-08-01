
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const radiologistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imagingTypes: z.string().min(1, 'Imaging Type is required'),
  scanReports: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addRadiologist(prevState: any, formData: FormData) {
  const validatedFields = radiologistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Radiologist.',
    };
  }
  const { name, ...radiologistData } = validatedFields.data;

  try {
     const userRef = adminDb.collection('users').doc(); 
     const uid = userRef.id;

    await userRef.set({
      uid,
      fullName: name,
      email: `radiologist.${uid.substring(0,5)}@zizoverse.io`,
      role: 'radiologist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('radiologists').doc(uid).set({
      ...radiologistData,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/admin/radiologists');
    return { type: 'success', message: `Added radiologist ${name}` };
  } catch (error) {
    console.error("Error adding radiologist:", error);
    return { type: 'error', message: 'Database Error: Failed to Create Radiologist.' };
  }
}

export async function updateRadiologist(id: string, prevState: any, formData: FormData) {
  const validatedFields = radiologistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Radiologist.',
    };
  }
  const { name, ...radiologistData } = validatedFields.data;

  try {
    await adminDb.collection('radiologists').doc(id).update(radiologistData);
    
    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/radiologists');
    return { type: 'success', message: `Updated radiologist ${name}` };
  } catch (error) {
    console.error("Error updating radiologist:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Radiologist.' };
  }
}

export async function deleteRadiologist(id: string) {
    try {
        await adminDb.collection('radiologists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/radiologists');
        return { type: 'success', message: 'Radiologist deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Radiologist.' };
    }
}
