// Script to set custom claims for all roles in Firebase Auth
// Run with: node scripts/set_all_roles_claims.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const users = [
  { uid: 'dOl8jmqXWGYi3f6j6dojObsXORv1', role: 'nurse' },
  { uid: 'Ahjlp1RbKXMzQYjs5Aa5SWAtzC83', role: 'lab_scientist' },
  { uid: '67PEkKHvcTTI0RQod2UIV3xDdfs2', role: 'pharmacist' },
  { uid: '5W4kdRDn5IYygoBoIxoUC568HV62', role: 'receptionist' },
  { uid: 'qpQPcG5A1aWzQM33ssrsy1JC18B2', role: 'radiologist' },
  { uid: 'Tug6RAd11NWKFMp97DjFoYjiet53', role: 'medical_records_officer' },
];

async function setAllRolesClaims() {
  for (const user of users) {
    try {
      await admin.auth().setCustomUserClaims(user.uid, { role: user.role });
      console.log(`Custom claim set for ${user.role}: ${user.uid}`);
    } catch (error) {
      console.error(`Error setting claim for ${user.role}:`, error.message);
    }
  }
  process.exit();
}

setAllRolesClaims();
