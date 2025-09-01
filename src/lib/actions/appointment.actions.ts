
'use server';

import { adminDb } from '../firebase-admin';
import admin from 'firebase-admin';
import { revalidatePath } from 'next/cache';

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  imageURL: string;
};

export async function getAvailableDoctors(): Promise<Doctor[]> {
  try {
    const snapshot = await adminDb.collection('doctors').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        specialty: data.specialty,
        imageURL: data.imageURL || 'https://placehold.co/80x80.png',
      };
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

type CreateAppointmentInput = {
    patientId: string;
    doctor: Doctor;
    date: string;
    time: string;
};

export async function createAppointment(input: CreateAppointmentInput) {
    const { patientId, doctor, date, time } = input;

    try {
        const appointmentRef = adminDb.collection('patients').doc(patientId).collection('appointments').doc();
        const eventRef = adminDb.collection('patients').doc(patientId).collection('patient_events').doc();
        
        const appointmentDate = new Date(date);
        
        const batch = adminDb.batch();

        batch.set(appointmentRef, {
            doctorId: doctor.id,
            doctor: doctor.name,
            specialty: doctor.specialty,
            date: appointmentDate,
            date_string: appointmentDate.toISOString().split('T')[0], // For simple equality queries
            time: time,
            status: 'Upcoming',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        batch.set(eventRef, {
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            eventType: 'APPOINTMENT_BOOKED',
            description: `Appointment scheduled with ${doctor.name} for ${appointmentDate.toLocaleDateString()} at ${time}.`,
            actorId: patientId,
        });

        await batch.commit();
        
        revalidatePath('/patient/dashboard');
        revalidatePath('/reception/dashboard');
        return { type: 'success', message: 'Appointment created successfully.' };

    } catch (error) {
        console.error('Error creating appointment:', error);
        return { type: 'error', message: 'Database Error: Failed to create appointment.' };
    }
}
