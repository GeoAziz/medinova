
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { PharmacistPrescription } from '@/lib/types';

export async function getPharmacistDashboardData(query?: string) {
  try {
    const prescriptionsSnapshot = await adminDb.collection('prescriptions').orderBy('receivedDate', 'desc').get();
    
    if (prescriptionsSnapshot.empty) {
        return {
            allPrescriptions: [],
            pendingCount: 0,
            readyForPickupCount: 0,
            outOfStockCount: 0,
        };
    }

    let allPrescriptions: PharmacistPrescription[] = prescriptionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            patientName: data.patientName,
            patientId: data.patientId,
            medication: data.medication,
            dosage: data.dosage,
            requestingDoctor: data.requestingDoctor,
            status: data.status,
            receivedDate: data.receivedDate.toDate().toLocaleString(),
        }
    });

    if (query) {
        const lowercasedQuery = query.toLowerCase();
        allPrescriptions = allPrescriptions.filter(p => 
            p.patientName.toLowerCase().includes(lowercasedQuery) ||
            p.medication.toLowerCase().includes(lowercasedQuery) ||
            p.requestingDoctor.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    const pendingCount = allPrescriptions.filter(p => p.status === 'Pending').length;
    const readyForPickupCount = allPrescriptions.filter(p => p.status === 'Ready for Pickup').length;
    const outOfStockCount = allPrescriptions.filter(p => p.status === 'Out of Stock').length;

    return {
        allPrescriptions,
        pendingCount,
        readyForPickupCount,
        outOfStockCount,
    };

  } catch (error) {
    console.error('Error fetching pharmacist dashboard data:', error);
    return {
        allPrescriptions: [],
        pendingCount: 0,
        readyForPickupCount: 0,
        outOfStockCount: 0,
    };
  }
}
