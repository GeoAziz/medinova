
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { ReceptionistAppointment, Patient } from '@/lib/types';
import { getAvailableDoctors } from './appointment.actions';

export async function getReceptionistDashboardData() {
    try {
        // In a real-world high-traffic app, querying all appointments like this could be slow.
        // For this scenario, we'll fetch today's appointments.
        // A more optimized approach would involve a dedicated top-level 'appointments' collection
        // with a 'date' field for efficient querying.

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (!adminDb) {
            throw new Error('adminDb is not initialized.');
        }
        const appointmentsSnapshot = await adminDb.collectionGroup('appointments')
            .orderBy('date', 'asc')
            .where('date', '>=', today.toISOString().split('T')[0])
            .where('date', '<', tomorrow.toISOString().split('T')[0])
            .get();

        if (appointmentsSnapshot.empty) {
            return {
                todaysAppointments: [],
                upcomingAppointmentsCount: 0,
                walkInsToday: 0, // Mocked for now
                checkedInCount: 0, // Mocked for now
                indexErrorLink: null,
                errorMessage: null,
            };
        }

        const appointmentsPromises = appointmentsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const patientId = doc.ref.parent.parent?.id;

            if (!patientId) return null;

            if (!adminDb) {
                throw new Error('adminDb is not initialized.');
            }
            const patientDoc = await adminDb.collection('users').doc(patientId).get();
            const patientName = patientDoc.exists ? patientDoc.data()?.fullName : 'Unknown Patient';
            
            return {
                id: doc.id,
                patientName: patientName,
                doctorName: data.doctor,
                time: data.time,
                status: data.status,
            } as ReceptionistAppointment;
        });

        const resolvedAppointments = await Promise.all(appointmentsPromises);
        const todaysAppointments = resolvedAppointments.filter(Boolean) as ReceptionistAppointment[];

        const upcomingAppointmentsCount = todaysAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed').length;
        const checkedInCount = todaysAppointments.filter(a => a.status === 'Checked-in' || a.status === 'Arrived').length;
        const walkInsToday = 0; // This would require a different data model to track accurately

        return {
            todaysAppointments: todaysAppointments.sort((a,b) => a.time.localeCompare(b.time)),
            upcomingAppointmentsCount,
            walkInsToday,
            checkedInCount,
            indexErrorLink: null,
            errorMessage: null,
        };

    } catch (error: any) {
        console.error('Error fetching receptionist dashboard data:', error);
        // If Firestore index error, provide link in returned object
        let indexErrorLink = null;
        let errorMessage = 'An unexpected error occurred.';

        if (error?.code === 9) { // FAILED_PRECONDITION
             // Extract the project ID from the service account if available
            const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id';
            indexErrorLink = `https://console.firebase.google.com/project/${projectId}/firestore/indexes?create_composite=EgtzYW1wbGVzGgRkYXRlGAEiAQAaDAoIZGF0ZUFzYxAB`;
            errorMessage = `This query requires a Firestore index. Please click the link to create it in the Firebase Console. The query failed because of: ${error.details}`;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return {
            todaysAppointments: [],
            upcomingAppointmentsCount: 0,
            walkInsToday: 0,
            checkedInCount: 0,
            indexErrorLink,
            errorMessage,
        };
    }
}
