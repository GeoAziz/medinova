
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { RecordAccessRequest, User } from '@/lib/types';
import admin from 'firebase-admin';

export async function getMroDashboardData(query?: string) {
    try {
        const accessRequestsSnapshot = await adminDb.collection('access_requests').orderBy('date', 'desc').get();
        if (accessRequestsSnapshot.empty) {
            return { accessRequests: [], pendingRequestsCount: 0 };
        }

        let requestsData = accessRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Collect all unique user IDs to fetch their names
        const userIds = new Set<string>();
        requestsData.forEach(req => {
            if (req.requesting_user_id) userIds.add(req.requesting_user_id);
            if (req.patient_id) userIds.add(req.patient_id);
        });

        const usersMap = new Map<string, string>();
        if (userIds.size > 0) {
            const usersSnapshot = await adminDb.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', Array.from(userIds)).get();
            usersSnapshot.docs.forEach(doc => {
                usersMap.set(doc.id, doc.data().fullName);
            });
        }
        
        let accessRequests: RecordAccessRequest[] = requestsData.map(req => ({
            id: req.id,
            requestingUserName: usersMap.get(req.requesting_user_id) || 'Unknown User',
            requestingUserRole: req.requestingRole || 'Unknown Role',
            patientId: req.patient_id,
            patientName: usersMap.get(req.patient_id) || 'Unknown Patient',
            reason: req.reason,
            status: req.status,
            date: req.date.toDate().toLocaleDateString(),
        }));
        
        if (query) {
            const lowercasedQuery = query.toLowerCase();
            accessRequests = accessRequests.filter(req => 
                req.requestingUserName.toLowerCase().includes(lowercasedQuery) ||
                req.patientName.toLowerCase().includes(lowercasedQuery)
            );
        }

        const pendingRequestsCount = accessRequests.filter(req => req.status === 'Pending').length;

        return {
            accessRequests,
            pendingRequestsCount
        };

    } catch (error) {
        console.error('Error fetching MRO dashboard data:', error);
        return {
            accessRequests: [],
            pendingRequestsCount: 0,
        };
    }
}
