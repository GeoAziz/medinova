
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
    const headerList = await headers();
    const sessionCookie = headerList.get('cookie')?.split('; ').find(c => c.startsWith('__session='));

    if (!sessionCookie) {
        // This is a placeholder for a non-logged-in user on the server, adapted for multi-role viewing.
        // It checks the path to determine which mock user to return.
        const pathname = headerList.get('next-url') || '';
        
        let role = 'patient'; // Default role
        if (pathname.startsWith('/doctor')) role = 'doctor';
        else if (pathname.startsWith('/admin')) role = 'admin';
        else if (pathname.startsWith('/nurse')) role = 'nurse';
        else if (pathname.startsWith('/lab')) role = 'lab_scientist';
        else if (pathname.startsWith('/pharmacist')) role = 'pharmacist';
        else if (pathname.startsWith('/reception')) role = 'receptionist';
        else if (pathname.startsWith('/radiologist')) role = 'radiologist';
        else if (pathname.startsWith('/medical-records')) role = 'medical_records_officer';

        if (!adminDb) {
            console.error('adminDb is null');
            return null;
        }
        const userSnapshot = await adminDb.collection('users').where('role', '==', role).limit(1).get();
        if (userSnapshot.empty) return null;
        
        const defaultUser = userSnapshot.docs[0].data();
        return {
            uid: userSnapshot.docs[0].id,
            email: defaultUser.email,
            role: defaultUser.role,
            fullName: defaultUser.fullName,
        };
    }
    
    const token = sessionCookie.split('=')[1];

    if (!token) {
        console.log('[AUTH] No token found in session cookie.');
        return null;}

    try {
        const decodedToken = await getAuth().verifySessionCookie(token, true);
        if (!adminDb) {
            console.error('adminDb is null');
            return null;
        }
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
