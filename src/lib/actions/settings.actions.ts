
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '../firebase-admin';
import { getAuthenticatedUser } from './auth.actions';

export async function getUserSettings() {
    const user = await getAuthenticatedUser();
    if (!user) {
        return null;
    }

    try {
        const userSettingsDoc = await adminDb.collection('user_settings').doc(user.uid).get();
        if (userSettingsDoc.exists) {
            return userSettingsDoc.data();
        }
        return {}; // Return empty object if no settings exist
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return null;
    }
}

export async function updateUserSettings(settings: Record<string, any>) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { type: 'error', message: 'User not authenticated.' };
    }

    try {
        await adminDb.collection('user_settings').doc(user.uid).set(settings, { merge: true });
        
        // Revalidate relevant paths if needed, e.g., revalidatePath('/lab/settings');
        
        return { type: 'success', message: 'Settings updated successfully.' };
    } catch (error) {
        console.error("Error updating user settings:", error);
        return { type: 'error', message: 'Failed to update settings.' };
    }
}
