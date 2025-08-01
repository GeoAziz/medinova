
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const pharmacistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  prescriptionLogs: z.coerce.number().min(0, 'Must be a positive number'),
  medicinesAvailable: z.coerce.number().min(0, 'Must be a positive number'),
});

export async function addPharmacist(prevState: any, formData: FormData) {
  const validatedFields = pharmacistSchema.safeParse({
      name: formData.get('name'),
      prescriptionLogs: formData.get('prescriptionLogs'),
      medicinesAvailable: formData.get('medicinesAvailable'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Pharmacist.',
    };
  }

  try {
    // This is a simplified approach. In a real app, you would create the user in Auth first,
    // get their UID, and then create these records.
    const { name, ...pharmacistData } = validatedFields.data;
    const docRef = await adminDb.collection('pharmacists').add({
      ...pharmacistData,
      name, // Keep name here for simpler queries if needed
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Created a pharmacist profile with ID: ", docRef.id);

    revalidatePath('/admin/pharmacists');
    return { type: 'success', message: `Added pharmacist ${name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Create Pharmacist.' };
  }
}

export async function updatePharmacist(id: string, prevState: any, formData: FormData) {
  const validatedFields = pharmacistSchema.safeParse({
      name: formData.get('name'),
      prescriptionLogs: formData.get('prescriptionLogs'),
      medicinesAvailable: formData.get('medicinesAvailable'),
  });

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

    // Also update the fullName in the corresponding /users document
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
    try {
        await adminDb.collection('pharmacists').doc(id).delete();
        revalidatePath('/admin/pharmacists');
        return { type: 'success', message: 'Pharmacist profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting pharmacist:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Pharmacist.' };
    }
}
