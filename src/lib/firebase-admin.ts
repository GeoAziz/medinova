// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// This is a private file and should not be exposed to the client.
// It uses the service account key to initialize the Admin SDK.

// Vercel deployment-friendly: Parse the service account from an environment variable.
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else {
    // Fallback for local development
    serviceAccount = require('../../serviceAccountKey.json');
  }
} catch (error) {
    console.error("Failed to parse Firebase service account JSON. Make sure the environment variable is set correctly.", error);
    // You might want to throw an error here or handle it gracefully
}


if (!admin.apps.length) {
  try {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        console.warn("Firebase Admin SDK not initialized. Service account credentials are missing.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.length ? admin.auth() : null;

// It's good practice to check if the services are available before exporting
if (!adminDb || !adminAuth) {
    console.error("Firebase Admin SDK services (Firestore or Auth) are not available.");
    // You can choose to export null or throw an error depending on your error handling strategy
}

export { adminDb, adminAuth };
