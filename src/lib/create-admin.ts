
// 🔐 Requires: Firebase Admin SDK initialized with service account
/*
 * This script creates the essential Admin user for the Zizo_MediVerse platform.
 * It's designed to be run once to set up the initial administrator account.
 */
import admin from 'firebase-admin';

// Use a dynamic require to avoid bundling issues, assuming serviceAccountKey is in the root
let serviceAccount;
try {
  serviceAccount = require('../../serviceAccountKey.json');
} catch (e) {
  console.error("=====================================================================");
  console.error("ERROR: serviceAccountKey.json not found in the root directory.");
  console.error("Please ensure the service account key from Firebase is present.");
  console.error("=====================================================================");
  process.exit(1);
}


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const adminEmail = 'admin@zizoverse.io';
const adminPassword = 'password123';
const adminFullName = 'SysAdmin Unit 734';

async function createAdminUser() {
  console.log('--- Starting Admin User Creation for Zizo_MediVerse ---');

  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      console.log(`✅ Admin user ${adminEmail} already exists. UID: ${userRecord.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // User does not exist, create them
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: adminFullName,
        });
        console.log(`🚀 Successfully created new admin user: ${adminEmail} with UID: ${userRecord.uid}`);
      } else {
        // Other error
        throw error;
      }
    }

    // Set custom claim for admin role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log(`🔑 Set custom claim 'role: admin' for ${adminEmail}`);

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: adminEmail,
      role: 'admin',
      fullName: adminFullName,
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection("users").doc(userRecord.uid).set(userProfile, { merge: true });
    console.log(`👤 Wrote admin profile to /users/${userRecord.uid} in Firestore.`);

    console.log("\n🎉 Admin user setup complete!");
    console.log("You can now log in with the following credentials:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('--- Admin Creation Script Finished ---');

  } catch (error) {
    console.error("❌ Error during admin user creation:", error);
    process.exit(1);
  }
}

createAdminUser();
