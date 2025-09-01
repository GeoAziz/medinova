// Script to set custom claims for doctor user in Firebase Auth
// Run with: node scripts/set_doctor_claim.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const doctorUid = 'u1ib6mEJwuOWhGibuX7BroCInpD2'; // Replace with actual UID if different

async function setDoctorClaim() {
  try {
    await admin.auth().setCustomUserClaims(doctorUid, { role: 'doctor' });
    console.log('Custom claim set for doctor user:', doctorUid);
  } catch (error) {
    console.error('Error setting custom claim:', error.message);
  }
  process.exit();
}

setDoctorClaim();
