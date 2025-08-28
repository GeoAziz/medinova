
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const pharmacistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  licenseNumber: z.string().min(1, 'License number is required'),
  shift: z.string().min(1, 'Shift is required'),
});

export async function addPharmacist(prevState: any, formData: FormData) {
  const validatedFields = pharmacistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Pharmacist.',
    };
  }

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  const { name, email, ...pharmacistData } = validatedFields.data;

  try {
    const userRecord = await adminAuth.createUser({ email, displayName: name });
    const uid = userRecord.uid;

    await adminAuth.setCustomUserClaims(uid, { role: 'pharmacist' });

    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'pharmacist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('pharmacists').doc(uid).set({
      ...pharmacistData,
      name,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/pharmacists');
    return { 
        type: 'success', 
        message: `Pharmacist ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
    return { type: 'error', message: 'Database Error: Failed to Create Pharmacist.' };
  }
}

export async function updatePharmacist(id: string, prevState: any, formData: FormData) {
  const validatedFields = pharmacistSchema.omit({ email: true }).safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Pharmacist.',
    };
  }
  const { name, ...pharmacistData } = validatedFields.data;

  try {
    await adminDb.collection('pharmacists').doc(id).update(pharmacistData);

    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/pharmacists');
    return { type: 'success', message: `Updated pharmacist ${name}` };
  } catch (error) {
    console.error("Error updating pharmacist:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Pharmacist.' };
  }
}

export async function deletePharmacist(id: string) {
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('pharmacists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        revalidatePath('/admin/pharmacists');
        return { type: 'success', message: 'Pharmacist profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting pharmacist:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Pharmacist.' };
    }
}
