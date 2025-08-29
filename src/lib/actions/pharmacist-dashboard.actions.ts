
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { PharmacistPrescription, PharmacistInventoryItem } from '@/lib/types';

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

export async function getPharmacistInventoryData(query?: string) {
    try {
        const inventorySnapshot = await adminDb.collection('inventory').orderBy('medicationName', 'asc').get();
        if (inventorySnapshot.empty) {
            return [];
        }

        let inventoryItems: PharmacistInventoryItem[] = inventorySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                medicationName: data.medicationName,
                ndc: data.ndc,
                quantity: data.quantity,
                status: data.status,
                lastRestock: data.lastRestock.toDate().toLocaleDateString(),
            };
        });

        if (query) {
            const lowercasedQuery = query.toLowerCase();
            inventoryItems = inventoryItems.filter(item => 
                item.medicationName.toLowerCase().includes(lowercasedQuery) ||
                item.ndc.toLowerCase().includes(lowercasedQuery)
            );
        }

        return inventoryItems;
    } catch (error) {
        console.error('Error fetching pharmacist inventory data:', error);
        return [];
    }
}
