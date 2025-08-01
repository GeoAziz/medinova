
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { z } from 'zod';
import admin from 'firebase-admin';

// Schema for detailed doctor profile in /doctors collection
const doctorProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().optional(),
  schedule: z.string().optional(),
});


export async function addDoctor(prevState: any, formData: FormData) {
  // This action is for creating the DOCTOR-SPECIFIC profile.
  // The USER part (auth, email, role) should be handled separately for security.
  const validatedFields = doctorProfileSchema.safeParse({
    name: formData.get('name'),
    specialty: formData.get('specialty'),
    department: formData.get('department'),
    bio: formData.get('bio'),
    schedule: formData.get('schedule'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Doctor Profile.',
    };
  }

  try {
    const { name, specialty, department, bio, schedule } = validatedFields.data;
    // Note: In a real app, you'd create the user in Firebase Auth first,
    // get their UID, and use that UID as the document ID here.
    // For this prototype, we'll create a new doc with an auto-ID.
    const docRef = await adminDb.collection('doctors').add({
      name,
      specialty,
      department,
      bio: bio || '',
      schedule: schedule || 'Not set',
      imageURL: 'https://placehold.co/200x200.png',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'Active', // Default status
    });
    
    // This is a simplified approach. A full implementation would link this to a user in /users.
    console.log("Created a doctor profile with ID: ", docRef.id);

    revalidatePath('/admin/doctors');
    return { type: 'success', message: `Added doctor profile for ${name}` };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { type: 'error', message: 'Database Error: Failed to Create Doctor Profile.' };
  }
}

export async function updateDoctor(id: string, prevState: any, formData: FormData) {
  const validatedFields = doctorProfileSchema.safeParse({
    name: formData.get('name'),
    specialty: formData.get('specialty'),
    department: formData.get('department'),
    bio: formData.get('bio'),
    schedule: formData.get('schedule'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Doctor Profile.',
    };
  }

  try {
     const { name, ...doctorData } = validatedFields.data;
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
        // This is a soft delete for the prototype.
        // In a real app, you might disable the user in Auth, archive the doc, etc.
        await adminDb.collection('doctors').doc(id).delete();
        // You would also delete or disable the user in the /users collection and Auth
        // await adminDb.collection('users').doc(id).delete();
        
        revalidatePath('/admin/doctors');
        return { type: 'success', message: 'Doctor profile deleted successfully.' };
    } catch (e) {
        console.error("Error deleting doctor:", e);
        return { type: 'error', message: 'Database Error: Failed to Delete Doctor.' };
    }
}
