
'use server';

import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import type { ChatContact, User } from '@/lib/types';

// Helper function to get user data from Firestore
async function getUser(uid: string): Promise<User | null> {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) return null;
    return { uid, ...userDoc.data() } as User;
}

export async function getChatContacts(userId: string): Promise<ChatContact[]> {
  const currentUser = await getUser(userId);
  if (!currentUser) return [];

  let contactIds: string[] = [];

  if (currentUser.role === 'patient') {
    // Patient: find their assigned doctor
    const patientDoc = await adminDb.collection('patients').doc(userId).get();
    const patientData = patientDoc.data();
    if (patientData?.assignedDoctor) {
      contactIds.push(patientData.assignedDoctor);
    }
  } else if (currentUser.role === 'doctor') {
    // Doctor: find their assigned patients
    const patientsSnapshot = await adminDb.collection('patients').where('assignedDoctor', '==', userId).get();
    contactIds = patientsSnapshot.docs.map(doc => doc.id);
  }

  if (contactIds.length === 0) return [];
  
  const contactUsersSnapshot = await adminDb.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', contactIds).get();

  const contacts = contactUsersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          name: data.fullName,
          role: data.role,
          avatar: data.profileImage || `https://placehold.co/40x40.png`,
      }
  }) as ChatContact[];

  // In a real app, you would also fetch the last message for each contact here.
  // For simplicity and to stay within Spark limits, we are omitting that for now.
  
  return contacts;
}

export async function sendMessage({ chatId, senderId, text }: { chatId: string, senderId: string, text: string }) {
    if (!chatId || !senderId || !text) {
        return { type: 'error', message: 'Missing required fields.' };
    }
    try {
        const message = {
            senderId,
            text,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        const chatRef = adminDb.collection('chats').doc(chatId);
        await chatRef.collection('messages').add(message);

        // Update the last message on the chat document itself for quick retrieval
        await chatRef.set({
            lastMessage: text,
            lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            participants: chatId.split('_'), // Store participants for querying
        }, { merge: true });

        return { type: 'success', message: 'Message sent.' };
    } catch (error) {
        console.error("Error sending message: ", error);
        return { type: 'error', message: 'Database Error: Failed to send message.' };
    }
}
