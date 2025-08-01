
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const labScientistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  labType: z.string().min(1, 'Lab Type is required'),
  recentTests: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addLabScientist(prevState: any, formData: FormData) {
  const validatedFields = labScientistSchema.safeParse({
    name: formData.get('name'),
    labType: formData.get('labType'),
    recentTests: formData.get('recentTests'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Lab Scientist.',
    };
  }

  try {
    // In a real app, you would have a more secure way to handle user creation and password setting.
    const userRef = adminDb.collection('users').doc(); 
    const uid = userRef.id;

    await userRef.set({
      uid,
      fullName: validatedFields.data.name,
      email: `scientist.${uid.substring(0,5)}@zizoverse.io`, // Placeholder email
      role: 'lab_scientist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('labScientists').doc(uid).set({
      name: validatedFields.data.name,
      labType: validatedFields.data.labType,
      recentTests: validatedFields.data.recentTests,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/admin/lab-scientists');
    return { type: 'success', message: `Added scientist ${validatedFields.data.name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Create Lab Scientist.' };
  }
}

export async function updateLabScientist(id: string, prevState: any, formData: FormData) {
  const validatedFields = labScientistSchema.safeParse({
    name: formData.get('name'),
    labType: formData.get('labType'),
    recentTests: formData.get('recentTests'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Lab Scientist.',
    };
  }
  const { name, ...scientistData } = validatedFields.data;

  try {
    await adminDb.collection('labScientists').doc(id).update(scientistData);
    
    // Also update the fullName in the corresponding /users document
    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/lab-scientists');
    return { type: 'success', message: `Updated scientist ${name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Update Lab Scientist.' };
  }
}

export async function deleteLabScientist(id: string) {
    try {
        await adminDb.collection('labScientists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/lab-scientists');
        return { type: 'success', message: 'Lab scientist deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Lab Scientist.' };
    }
}
