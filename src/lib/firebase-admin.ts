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
    // This catch block will handle errors from both parsing the env var and requiring the local file.
    console.error("Failed to load Firebase service account credentials.", error);
    serviceAccount = null; // Ensure serviceAccount is null if loading fails
}


if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    // This is the critical new part.
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set and serviceAccountKey.json was not found.');
    // In a real production scenario, you might want to throw an error to fail fast.
    // For now, we'll log a very clear error.
  }
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.length ? admin.auth() : null;

// It's good practice to check if the services are available before exporting
if (!adminDb || !adminAuth) {
    console.error("Firebase Admin SDK services (Firestore or Auth) are not available. This is likely due to a missing or invalid service account configuration.");
}

export { adminDb, adminAuth };