
'use server';

import { adminDb } from '../firebase-admin';

export type PatientEvent = {
    id: string;
    timestamp: string; 
    eventType: string;
    description: string;
    actorId: string;
}

export async function getPatientEvents(patientId: string): Promise<PatientEvent[]> {
    if (!adminDb) {
        console.error("Firestore not available");
        return [];
    }

    try {
        const snapshot = await adminDb
            .collection('patients')
            .doc(patientId)
            .collection('patient_events')
            .orderBy('timestamp', 'desc')
            .get();
        
        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                description: data.description,
                eventType: data.eventType,
                actorId: data.actorId,
                // Convert Firestore Timestamp to a serializable string
                timestamp: data.timestamp.toDate().toLocaleString(),
            };
        }) as PatientEvent[];
    } catch (error) {
        console.error("Error fetching patient events for patientId:", patientId, error);
        return [];
    }
}
