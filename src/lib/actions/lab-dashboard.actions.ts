
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { LabTest } from '@/lib/types';

export async function getLabDashboardData() {
  try {
    // collectionGroup allows us to query across all 'lab_tests' subcollections
    // regardless of the parent patient document. This is efficient for this role.
    const labTestsSnapshot = await adminDb.collectionGroup('lab_tests').get();
    
    if (labTestsSnapshot.empty) {
        return {
            allTests: [],
            pendingTests: 0,
            completedToday: 0,
            rejectedSamples: 0,
        };
    }

    const allTests: LabTest[] = [];

    for (const doc of labTestsSnapshot.docs) {
        const data = doc.data();
        const patientId = doc.ref.parent.parent?.id; // Get the patientId from the path
        if (!patientId) continue;

        // In a real app, you might fetch patient/doctor details here or denormalize them.
        // For now, we'll use placeholder data where necessary.
        allTests.push({
            id: doc.id,
            patientId: patientId,
            patientName: data.patientName || `Patient ${patientId.substring(0,4)}`,
            testType: data.testType || 'N/A',
            requestingDoctor: data.requestingDoctor || 'N/A',
            status: data.status || 'Pending',
            // Convert Firestore Timestamp to a serializable string
            receivedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        });
    }

    const pendingTests = allTests.filter(t => t.status === 'Pending').length;
    const rejectedSamples = allTests.filter(t => t.status === 'Rejected').length;
    
    // This is a simplified calculation for "today". A real app might need timezone handling.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = allTests.filter(t => {
       const testDate = new Date(t.receivedDate);
       return t.status === 'Completed' && testDate >= today;
    }).length;


    return {
        allTests: allTests.sort((a,b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()),
        pendingTests,
        completedToday,
        rejectedSamples,
    };

  } catch (error) {
    console.error('Error fetching lab dashboard data:', error);
    return {
      allTests: [],
      pendingTests: 0,
      completedToday: 0,
      rejectedSamples: 0,
    };
  }
}
