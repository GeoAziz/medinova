
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';

type AuthenticatedUser = {
    uid: string;
    email: string;
    role: string;
    fullName: string;
};

// This is a simplified way to get the user on the server.
// In a real app, you'd want a more robust session management solution.
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
    const headerList = headers();
    const sessionCookie = headerList.get('cookie')?.split('; ').find(c => c.startsWith('__session='));

    if (!sessionCookie) {
        // This is a placeholder for a non-logged-in user on the server.
        // In a real app, you'd likely have a proper auth flow.
        // For now, let's return the default doctor for the dashboard.
        const docSnapshot = await adminDb.collection('users').where('email', '==', 'doctor@zizoverse.io').limit(1).get();
        if (docSnapshot.empty) return null;
        const defaultDoctor = docSnapshot.docs[0].data();
        return {
            uid: docSnapshot.docs[0].id,
            email: defaultDoctor.email,
            role: defaultDoctor.role,
            fullName: defaultDoctor.fullName,
        }
    }
    
    const token = sessionCookie.split('=')[1];

    if (!token) {
        return null;
    }

    try {
        const decodedToken = await getAuth().verifySessionCookie(token, true);
        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) return null;

        const userData = userDoc.data() as any;

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            role: userData.role,
            fullName: userData.fullName,
        };
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}
