
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  age: z.coerce.number().min(0, 'Age must be a positive number'),
  gender: z.string().min(1, 'Gender is required'),
  room: z.string().min(1, 'Room assignment is required'),
  nationalId: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  assignedDoctor: z.string().optional(),
  status: z.string().optional(),
});

export async function addPatient(prevState: any, formData: FormData) {
  const validatedFields = patientSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Patient.',
    };
  }

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  const { name, email, ...patientData } = validatedFields.data;

  try {
    const userRecord = await adminAuth.createUser({ email, displayName: name });
    const uid = userRecord.uid;

    await adminAuth.setCustomUserClaims(uid, { role: 'patient' });

    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'patient',
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('patients').doc(uid).set({
      ...patientData,
      name,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/patients');
    return { 
        type: 'success', 
        message: `Patient ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error("Error adding patient:", error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
    return { type: 'error', message: 'Database Error: Failed to Create Patient.' };
  }
}

export async function updatePatient(id: string, prevState: any, formData: FormData) {
  const validatedFields = patientSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Patient.',
    };
  }
  const { name, email, ...patientData } = validatedFields.data;

  try {
    await adminDb.collection('patients').doc(id).update({
        ...patientData,
        name,
    });
    
    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });


    revalidatePath('/admin/patients');
    return { type: 'success', message: `Updated patient ${name}` };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Patient.' };
  }
}

export async function deletePatient(id: string) {
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('patients').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        revalidatePath('/admin/patients');
        return { type: 'success', message: 'Patient deleted successfully.' };
    } catch (e) {
        console.error("Error deleting patient:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Patient.' };
    }
}
