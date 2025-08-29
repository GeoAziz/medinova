
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { ScanRequest } from '@/lib/types';

export async function getRadiologistDashboardData(query?: string) {
  try {
    const scanRequestsSnapshot = await adminDb.collection('scan_requests').orderBy('requestDate', 'desc').get();
    
    if (scanRequestsSnapshot.empty) {
        return {
            allScans: [],
            pendingCount: 0,
            reviewedTodayCount: 0,
        };
    }

    let allScans: ScanRequest[] = scanRequestsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            patientName: data.patientName || 'N/A',
            patientId: data.patientId || 'N/A',
            scanType: data.scanType || 'N/A',
            requestingDoctor: data.requestingDoctor || 'N/A',
            status: data.status || 'Pending',
            requestDate: data.requestDate.toDate().toLocaleDateString(),
            imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        };
    });
    
    if (query) {
        const lowercasedQuery = query.toLowerCase();
        allScans = allScans.filter(scan => 
            scan.patientName.toLowerCase().includes(lowercasedQuery) ||
            scan.scanType.toLowerCase().includes(lowercasedQuery) ||
            scan.id.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    const pendingCount = allScans.filter(s => s.status === 'Pending').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviewedTodayCount = allScans.filter(s => {
       const scanDate = new Date(s.requestDate);
       return s.status === 'Reviewed' && scanDate >= today;
    }).length;

    return {
        allScans,
        pendingCount,
        reviewedTodayCount,
    };

  } catch (error) {
    console.error('Error fetching radiologist dashboard data:', error);
    return {
        allScans: [],
        pendingCount: 0,
        reviewedTodayCount: 0,
    };
  }
}
