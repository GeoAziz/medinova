
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

const pharmacistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  prescriptionLogs: z.coerce.number().min(0, 'Must be a positive number'),
  medicinesAvailable: z.coerce.number().min(0, 'Must be a positive number'),
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

  const { name, email, ...pharmacistData } = validatedFields.data;

  try {
    // In a real app, you would have a more secure way to handle user creation and password setting.
    // For this prototype, we assume an admin creates the user and a password email is sent separately.
    // Here, we just create the user profile documents. We are not creating an Auth user.
    // This would typically be a two-step process or a callable function.
    
    // For simplicity, we'll auto-generate a UID. In a real app, this would come from Firebase Auth.
    const userRef = adminDb.collection('users').doc(); 
    const uid = userRef.id;

    await userRef.set({
      uid,
      fullName: name,
      email,
      role: 'pharmacist',
      profileImage: 'https://placehold.co/128x128.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await adminDb.collection('pharmacists').doc(uid).set({
      ...pharmacistData,
      name, // Keep name here for simpler queries if needed
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Created a user and pharmacist profile with ID: ", uid);

    revalidatePath('/admin/pharmacists');
    return { type: 'success', message: `Added pharmacist ${name}` };
  } catch (error) {
    console.error(error);
    return { type: 'error', message: 'Database Error: Failed to Create Pharmacist.' };
  }
}

export async function updatePharmacist(id: string, prevState: any, formData: FormData) {
  const validatedFields = pharmacistSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Pharmacist.',
    };
  }
  const { name, email, ...pharmacistData } = validatedFields.data;

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
    try {
        await adminDb.collection('pharmacists').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        // In a real app, you'd also delete the user from Firebase Auth
        revalidatePath('/admin/pharmacists');
        return { type: 'success', message: 'Pharmacist profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting pharmacist:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Pharmacist.' };
    }
}
