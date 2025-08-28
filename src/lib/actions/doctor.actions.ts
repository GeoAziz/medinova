
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

// Schema for detailed doctor profile in /doctors collection
const doctorProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().optional(),
  schedule: z.string().optional(),
});


export async function addDoctor(prevState: any, formData: FormData) {
  const validatedFields = doctorProfileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Doctor Profile.',
    };
  }

  const { name, email, specialty, department, bio, schedule } = validatedFields.data;

  try {
    // This is a simplified approach. In a real app, you would create the user in Auth first.
    const userRef = adminDb.collection('users').doc();
    const uid = userRef.id;

    // 1. Create the record in the /users collection
    await userRef.set({
      uid,
      fullName: name,
      email,
      role: 'doctor',
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Create the record in the /doctors collection using the same UID
    await adminDb.collection('doctors').doc(uid).set({
      name,
      specialty,
      department,
      bio: bio || '',
      schedule: schedule || 'Not set',
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'Active', // Default status
    });

    revalidatePath('/admin/doctors');
    return { type: 'success', message: `Added doctor profile for ${name}` };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { type: 'error', message: 'Database Error: Failed to Create Doctor Profile.' };
  }
}

export async function updateDoctor(id: string, prevState: any, formData: FormData) {
  const validatedFields = doctorProfileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Doctor Profile.',
    };
  }

  try {
     const { name, email, ...doctorData } = validatedFields.data;
     const updateData: any = {
        ...doctorData,
        name,
        bio: doctorData.bio || '',
        schedule: doctorData.schedule || 'Not set',
     };

    await adminDb.collection('doctors').doc(id).update(updateData);

    // Also update the fullName in the corresponding /users document
    const userRef = adminDb.collection('users').doc(id);
    await userRef.update({ fullName: name });

    revalidatePath('/admin/doctors');
    return { type: 'success', message: `Updated doctor profile for ${name}` };
  } catch (error) {
    console.error("Error updating doctor:", error);
    return { type: 'error', message: 'Database Error: Failed to Update Doctor Profile.' };
  }
}

export async function deleteDoctor(id: string) {
    try {
        await adminDb.collection('doctors').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        
        revalidatePath('/admin/doctors');
        return { type: 'success', message: 'Doctor profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting doctor:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Doctor.' };
    }
}
