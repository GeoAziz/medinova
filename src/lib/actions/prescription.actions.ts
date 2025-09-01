
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import admin from 'firebase-admin';
import { getAuthenticatedUser } from './auth.actions';

type UpdateStatusParams = {
    prescriptionId: string;
    newStatus: 'Fulfilled' | 'Rejected' | 'Ready for Pickup';
    rejectionReason?: string;
}

async function updatePrescriptionStatus({ prescriptionId, newStatus, rejectionReason }: UpdateStatusParams) {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'pharmacist') {
        return { type: 'error', message: 'Unauthorized' };
    }

    try {
        const batch = adminDb.batch();
        const prescriptionRef = adminDb.collection('prescriptions').doc(prescriptionId);
        
        const updateData: { status: string; fulfilledBy?: string; fulfilledAt?: any, rejectionReason?: string } = {
            status: newStatus,
        };

        if (newStatus === 'Fulfilled') {
            updateData.fulfilledBy = user.uid;
            updateData.fulfilledAt = admin.firestore.FieldValue.serverTimestamp();
        }

        if (newStatus === 'Rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        batch.update(prescriptionRef, updateData);

        await batch.commit();

        revalidatePath('/pharmacist/prescriptions');
        revalidatePath('/pharmacist/dashboard');
        
        return { type: 'success', message: `Prescription marked as ${newStatus}.` };

    } catch (error) {
        console.error("Error updating prescription status:", error);
        return { type: 'error', message: 'Database Error: Failed to update prescription.' };
    }
}


export async function fulfillPrescription(prescriptionId: string) {
    return updatePrescriptionStatus({ prescriptionId, newStatus: 'Fulfilled' });
}

export async function rejectPrescription(prescriptionId: string, reason: string) {
    return updatePrescriptionStatus({ prescriptionId, newStatus: 'Rejected', rejectionReason: reason });
}
