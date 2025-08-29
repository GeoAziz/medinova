
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Patient, Appointment } from '@/lib/types';

export async function getDoctorDashboardData(doctorId: string) {
  try {
    // 1. Fetch patients assigned to the doctor
    const patientsQuery = adminDb.collection('patients').where('assignedDoctor', '==', doctorId);
    const patientsSnapshot = await patientsQuery.get();
    const assignedPatients = patientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];

    if (assignedPatients.length === 0) {
      return { assignedPatients: [], upcomingAppointments: [] };
    }

    // 2. Fetch upcoming appointments for those patients
    const upcomingAppointments: Appointment[] = [];
    const patientIds = assignedPatients.map(p => p.id);

    // Firestore 'in' queries are limited to 30 items. For more patients, you'd need multiple queries.
    const appointmentsQuery = adminDb.collectionGroup('appointments')
        .where('doctorId', '==', doctorId)
        .where('status', '==', 'Upcoming')
        .orderBy('date', 'asc');
        
    const appointmentsSnapshot = await appointmentsQuery.get();

    for (const doc of appointmentsSnapshot.docs) {
        const appointmentData = doc.data();
        const patientId = doc.ref.parent.parent?.id;
        const patient = assignedPatients.find(p => p.id === patientId);

        if (patient) {
            upcomingAppointments.push({
                id: doc.id,
                patientId: patient.id,
                patientName: patient.name,
                doctorId: appointmentData.doctorId,
                doctorName: appointmentData.doctor,
                date: new Date(appointmentData.date).toLocaleDateString(),
                time: appointmentData.time,
                status: 'Upcoming',
            });
        }
    }

    return {
      assignedPatients,
      upcomingAppointments: upcomingAppointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    };
  } catch (error) {
    console.error('Error fetching doctor dashboard data:', error);
    return {
      assignedPatients: [],
      upcomingAppointments: [],
    };
  }
}
