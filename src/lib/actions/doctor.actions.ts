
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb, adminAuth } from '../firebase-admin';
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

  if (!adminAuth) {
    return { type: 'error', message: 'Authentication service not available.'};
  }

  try {
    // 1. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      displayName: name,
    });
    const uid = userRecord.uid;

    // 2. Set the custom role claim
    await adminAuth.setCustomUserClaims(uid, { role: 'doctor' });

    // 3. Create the user record in /users collection
    await adminDb.collection('users').doc(uid).set({
      uid,
      fullName: name,
      email,
      role: 'doctor',
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Create the doctor profile in /doctors collection
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

    // 5. Generate password reset link
    const link = await adminAuth.generatePasswordResetLink(email);

    revalidatePath('/admin/doctors');
    return { 
        type: 'success', 
        message: `Doctor ${name} created. Share this link for password setup:`,
        link: link,
    };
  } catch (error: any) {
    console.error("Error adding doctor:", error);
    if (error.code === 'auth/email-already-exists') {
        return { type: 'error', message: 'This email is already registered.' };
    }
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
    if (!adminAuth) {
      return { type: 'error', message: 'Authentication service not available.'};
    }
    try {
        await adminDb.collection('doctors').doc(id).delete();
        await adminDb.collection('users').doc(id).delete();
        await adminAuth.deleteUser(id);
        
        revalidatePath('/admin/doctors');
        return { type: 'success', message: 'Doctor profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting doctor:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Doctor.' };
    }
}
