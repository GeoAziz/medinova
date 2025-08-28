
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const labScientistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  labType: z.string().min(1, 'Lab Type is required'),
  recentTests: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addLabScientist(prevState: any, formData: FormData) {
  const validatedFields = labScientistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Lab Scientist.',
    };
  }

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  const { name, email, labType, recentTests } = validatedFields.data;

  try {
    const userRecord = await adminAuth.createUser({ email, displayName: name });
    const uid = userRecord.uid;

    await adminAuth.setCustomUserClaims(uid, { role: 'lab_scientist' });

    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'lab_scientist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('labScientists').doc(uid).set({
      name: name,
      labType: labType,
      recentTests: recentTests,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/lab-scientists');
    return { 
        type: 'success', 
        message: `Scientist ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
    return { type: 'error', message: 'Database Error: Failed to Create Lab Scientist.' };
  }
}

export async function updateLabScientist(id: string, prevState: any, formData: FormData) {
    const validatedFields = labScientistSchema.omit({email: true}).safeParse(Object.fromEntries(formData.entries()));

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
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('labScientists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        revalidatePath('/admin/lab-scientists');
        return { type: 'success', message: 'Lab scientist deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Lab Scientist.' };
    }
}
