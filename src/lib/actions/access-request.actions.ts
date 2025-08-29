
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import admin from 'firebase-admin';
import { getAuthenticatedUser } from './auth.actions';


async function updateRequestStatus(requestId: string, patientId: string, newStatus: 'Approved' | 'Denied') {
    const mro = await getAuthenticatedUser();
    if (!mro || mro.role !== 'medical_records_officer') {
        return { type: 'error', message: 'Unauthorized action.' };
    }

    try {
        const requestRef = adminDb.collection('access_requests').doc(requestId);
        const eventRef = adminDb.collection('patients').doc(patientId).collection('patient_events').doc();

        const batch = adminDb.batch();

        batch.update(requestRef, { status: newStatus });
        
        const description = newStatus === 'Approved' 
            ? `Record access request ${requestId.substring(0,6)}... approved by MRO ${mro.fullName}.`
            : `Record access request ${requestId.substring(0,6)}... denied by MRO ${mro.fullName}.`;
            
        batch.set(eventRef, {
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            eventType: `ACCESS_${newStatus.toUpperCase()}`,
            description,
            actorId: mro.uid,
        });

        await batch.commit();

        revalidatePath('/medical-records/requests');
        revalidatePath('/medical-records/dashboard');
        return { type: 'success', message: `Request has been ${newStatus.toLowerCase()}.` };
    } catch (error) {
        console.error(`Error updating request ${requestId}:`, error);
        return { type: 'error', message: 'Database Error: Failed to update request.' };
    }
}

export async function approveAccessRequest(requestId: string, patientId: string) {
    return updateRequestStatus(requestId, patientId, 'Approved');
}

export async function denyAccessRequest(requestId: string, patientId: string) {
    return updateRequestStatus(requestId, patientId, 'Denied');
}
