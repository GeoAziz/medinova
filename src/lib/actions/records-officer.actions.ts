
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const recordsOfficerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  recordAccessLogs: z.coerce.number().min(0, 'Must be a positive number'),
  reportsGenerated: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addRecordsOfficer(prevState: any, formData: FormData) {
  const validatedFields = recordsOfficerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Records Officer.',
    };
  }

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  const { name, email, ...officerData } = validatedFields.data;

  try {
    const userRecord = await adminAuth.createUser({ email, displayName: name });
    const uid = userRecord.uid;

    await adminAuth.setCustomUserClaims(uid, { role: 'medical_records_officer' });

    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'medical_records_officer',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('medicalRecordsOfficers').doc(uid).set({
      ...officerData,
      name,
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/records-officers');
    return { 
        type: 'success', 
        message: `Records Officer ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
    return { type: 'error', message: 'Database Error: Failed to Create Records Officer.' };
  }
}

export async function updateRecordsOfficer(id: string, prevState: any, formData: FormData) {
  const validatedFields = recordsOfficerSchema.omit({email: true}).safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Records Officer.',
    };
  }
  const { name, ...officerData } = validatedFields.data;

  try {
    await adminDb.collection('medicalRecordsOfficers').doc(id).update(officerData);

    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/records-officers');
    return { type: 'success', message: `Updated officer ${name}` };
  } catch (error) {
    console.error("Error updating officer:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Records Officer.' };
  }
}

export async function deleteRecordsOfficer(id: string) {
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('medicalRecordsOfficers').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        revalidatePath('/admin/records-officers');
        return { type: 'success', message: 'Records Officer profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting officer:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Records Officer.' };
    }
}
