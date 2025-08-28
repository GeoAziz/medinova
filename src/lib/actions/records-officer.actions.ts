
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
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

  const { name, email, ...officerData } = validatedFields.data;

  try {
    const userRef = adminDb.collection('users').doc(); 
    const uid = userRef.id;

    await userRef.set({
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

    revalidatePath('/admin/records-officers');
    return { type: 'success', message: `Added Records Officer ${name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Create Records Officer.' };
  }
}

export async function updateRecordsOfficer(id: string, prevState: any, formData: FormData) {
  const validatedFields = recordsOfficerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Records Officer.',
    };
  }
  const { name, email, ...officerData } = validatedFields.data;

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
    try {
        await adminDb.collection('medicalRecordsOfficers').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        revalidatePath('/admin/records-officers');
        return { type: 'success', message: 'Records Officer profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting officer:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Records Officer.' };
    }
}
