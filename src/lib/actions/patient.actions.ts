
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
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

  try {
    await adminDb.collection('patients').add({
      ...validatedFields.data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/admin/patients');
    return { type: 'success', message: `Added patient ${validatedFields.data.name}` };
  } catch (error) {
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

  try {
    await adminDb.collection('patients').doc(id).update(validatedFields.data);
    revalidatePath('/admin/patients');
    return { type: 'success', message: `Updated patient ${validatedFields.data.name}` };
  } catch (error) {
    return { type: 'error', message: 'Database Error: Failed to Update Patient.' };
  }
}

export async function deletePatient(id: string) {
    try {
        await adminDb.collection('patients').doc(id).delete();
        revalidatePath('/admin/patients');
        return { type: 'success', message: 'Patient deleted successfully.' };
    } catch (e) {
        return { type: 'error', message: 'Database Error: Failed to Delete Patient.' };
    }
}
