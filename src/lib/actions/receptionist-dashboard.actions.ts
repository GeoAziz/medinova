
'use server';

import { adminDb } from '../firebase-admin';
import type { ReceptionistAppointment, Patient } from '@/lib/types';
import { getAvailableDoctors } from './appointment.actions';

export async function getReceptionistDashboardData() {
    try {
        const todayString = new Date().toISOString().split('T')[0];

        if (!adminDb) {
            throw new Error('adminDb is not initialized.');
        }

        // Query each user's appointments subcollection directly
        const usersSnapshot = await adminDb.collection('users').get();
        let allAppointments: ReceptionistAppointment[] = [];

        for (const userDoc of usersSnapshot.docs) {
            const appointmentsSnapshot = await adminDb
                .collection('users')
                .doc(userDoc.id)
                .collection('appointments')
                .where('date_string', '==', todayString)
                .get();

            appointmentsSnapshot.forEach(doc => {
                const data = doc.data();
                allAppointments.push({
                    id: doc.id,
                    patientName: userDoc.data().fullName,
                    doctorName: data.doctor,
                    time: data.time,
                    status: data.status,
                });
            });
        }

        const upcomingAppointmentsCount = allAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed').length;
        const checkedInCount = allAppointments.filter(a => a.status === 'Checked-in' || a.status === 'Arrived').length;
        const walkInsToday = 0;

        return {
            todaysAppointments: allAppointments.sort((a,b) => a.time.localeCompare(b.time)),
            upcomingAppointmentsCount,
            walkInsToday,
            checkedInCount,
            errorMessage: null,
            indexErrorLink: null,
        };

    } catch (error: any) {
        console.error('Error fetching receptionist dashboard data:', error);
        
        let errorMessage = 'An unexpected error occurred.';
        let indexErrorLink: string | null = null;
        
        if (error.code === 9 || (error.message && error.message.includes('FAILED_PRECONDITION'))) {
            errorMessage = "The query requires an index. Please create it in your Firebase console.";
            const urlMatch = error.message.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                indexErrorLink = urlMatch[0];
                errorMessage = "The query requires an index. Click the button below to create it in your Firebase console, then refresh this page."
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        return {
            todaysAppointments: [],
            upcomingAppointmentsCount: 0,
            walkInsToday: 0,
            checkedInCount: 0,
            errorMessage,
            indexErrorLink,
        };
    }
}
