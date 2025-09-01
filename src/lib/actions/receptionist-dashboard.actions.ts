
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
        
        const appointmentsSnapshot = await adminDb.collectionGroup('appointments')
            .where('date_string', '==', todayString)
            .get();

        if (appointmentsSnapshot.empty) {
            return {
                todaysAppointments: [],
                upcomingAppointmentsCount: 0,
                walkInsToday: 0,
                checkedInCount: 0,
                errorMessage: null,
                indexErrorLink: null,
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
        const walkInsToday = 0;

        return {
            todaysAppointments: todaysAppointments.sort((a,b) => a.time.localeCompare(b.time)),
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
