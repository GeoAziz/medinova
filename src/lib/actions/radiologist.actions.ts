
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const radiologistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
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

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  const { name, email, ...radiologistData } = validatedFields.data;

  try {
     const userRecord = await adminAuth.createUser({ email, displayName: name });
     const uid = userRecord.uid;

    await adminAuth.setCustomUserClaims(uid, { role: 'radiologist' });

    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'radiologist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('radiologists').doc(uid).set({
      ...radiologistData,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/radiologists');
    return { 
        type: 'success', 
        message: `Radiologist ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error("Error adding radiologist:", error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
    return { type: 'error', message: 'Database Error: Failed to Create Radiologist.' };
  }
}

export async function updateRadiologist(id: string, prevState: any, formData: FormData) {
  const validatedFields = radiologistSchema.omit({ email: true }).safeParse(Object.fromEntries(formData.entries()));

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
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('radiologists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        revalidatePath('/admin/radiologists');
        return { type: 'success', message: 'Radiologist deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Radiologist.' };
    }
}
