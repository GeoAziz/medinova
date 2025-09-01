
// 🔐 Requires: Firebase Admin SDK initialized with service account
/*
 * This script populates the Firestore database with a realistic, interconnected
 * set of data for a single patient journey, using pre-existing authenticated users.
 * It's designed to be run after the initial users have been created.
 */
import admin from 'firebase-admin';

// Use a dynamic require to avoid bundling issues
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

const db = admin.firestore();

// --- HARDCODED UIDs FROM YOUR AUTHENTICATED USERS ---
const USER_IDS = {
    patient: 'igKUPzZS7lZezAk7WcCybUOz1Hr2',
    doctor: 'u1ib6mEJwuOWhGibuX7BroCInpD2',
    nurse: 'dOl8jmqXWGYi3f6j6dojObsXORv1',
    pharmacist: '67PEkKHvcTTI0RQod2UIV3xDdfs2',
    lab_scientist: 'Ahjlp1RbKXMzQYjs5Aa5SWAtzC83',
    radiologist: 'qpQPcG5A1aWzQM33ssrsy1JC18B2',
    receptionist: '5W4kdRDn5IYygoBoIxoUC568HV62',
    medical_records_officer: 'Tug6RAd11NWKFMp97DjFoYjiet53',
    admin: '3k3aOMenQphopCxNtyejBDSBOCT2',
};

// --- HELPER FUNCTION TO GET USER FULL NAME ---
async function getUserFullName(uid: string): Promise<string> {
    if (!uid) return 'Unknown';
    const userDoc = await db.collection('users').doc(uid).get();
    return userDoc.exists ? userDoc.data()?.fullName || 'Unknown' : 'Unknown';
}


async function populateVirtualHospital() {
  console.log('--- 🚀 Starting Hospital Data Population ---');
  const batch = db.batch();

  const doctorName = await getUserFullName(USER_IDS.doctor);
  const patientName = await getUserFullName(USER_IDS.patient);
  const nurseName = await getUserFullName(USER_IDS.nurse);

  // 1. Update Patient Record with Assigned Doctor and Ward
  const patientRef = db.collection('patients').doc(USER_IDS.patient);
  batch.update(patientRef, {
      assignedDoctor: USER_IDS.doctor,
      ward: 'Cardiovascular Wing',
      condition: 'Needs Monitoring',
      diagnosis: 'Hypertension and Arrhythmia',
  });
  console.log(`- Assigning Dr. ${doctorName} to patient ${patientName}.`);

  // 2. Update Nurse Record with Ward Assignment
  const nurseRef = db.collection('nurses').doc(USER_IDS.nurse);
  batch.update(nurseRef, { ward: 'Cardiovascular Wing', shift: 'Day (7am-7pm)' });
  console.log(`- Assigning Nurse ${nurseName} to the Cardiovascular Wing.`);

  // 3. Create a future Appointment for the patient with the doctor
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 3); // 3 days from now
  const appointmentRef = db.collection('patients').doc(USER_IDS.patient).collection('appointments').doc();
  batch.set(appointmentRef, {
      doctorId: USER_IDS.doctor,
      doctor: doctorName,
      specialty: 'Cardiology',
      date: admin.firestore.Timestamp.fromDate(appointmentDate),
      date_string: appointmentDate.toISOString().split('T')[0],
      time: '10:30 AM',
      status: 'Upcoming',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`- Booking an appointment for ${patientName} with Dr. ${doctorName}.`);

  // 4. Create a Lab Test Request from the doctor for the patient
  const labTestRef = db.collection('lab_tests').doc();
  batch.set(labTestRef, {
      patientId: USER_IDS.patient,
      patientName: patientName,
      testType: 'Lipid Panel',
      requestingDoctor: doctorName,
      status: 'Pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`- Dr. ${doctorName} is requesting a Lipid Panel for ${patientName}.`);

  // 5. Create a Scan Request from the doctor for the patient
  const scanRequestRef = db.collection('scan_requests').doc();
  batch.set(scanRequestRef, {
      patientId: USER_IDS.patient,
      patientName: patientName,
      scanType: 'CT Scan',
      requestingDoctor: doctorName,
      status: 'Pending',
      requestDate: admin.firestore.Timestamp.now(),
      imageUrl: 'https://picsum.photos/seed/ctscan/600/400'
  });
  console.log(`- Dr. ${doctorName} is requesting a CT Scan for ${patientName}.`);

  // 6. Create a Prescription from the doctor for the patient
  const prescriptionRef = db.collection('prescriptions').doc();
  batch.set(prescriptionRef, {
      patientId: USER_IDS.patient,
      patientName: patientName,
      medication: 'Amlodipine',
      dosage: '10mg, once daily',
      requestingDoctor: doctorName,
      status: 'Pending',
      receivedDate: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`- Dr. ${doctorName} is prescribing Amlodipine for ${patientName}.`);

  // 7. Create a Task for the Nurse related to the Patient
  const taskRef = db.collection('tasks').doc();
  batch.set(taskRef, {
      patientId: USER_IDS.patient,
      task: "Monitor blood pressure every 4 hours.",
      priority: 'Medium',
      isCompleted: false,
      dueDate: admin.firestore.Timestamp.fromDate(appointmentDate)
  });
  console.log(`- Assigning a task to Nurse ${nurseName} for patient ${patientName}.`);
  
  // 8. Create an Access Request for the patient's records
  const accessRequestRef = db.collection('access_requests').doc();
  batch.set(accessRequestRef, {
      patient_id: USER_IDS.patient,
      requesting_user_id: USER_IDS.radiologist, // Example: Radiologist needs access
      requestingRole: 'Radiologist',
      reason: 'Reviewing past scans for context on new CT Scan request.',
      status: 'Pending',
      date: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`- Radiologist is requesting access to ${patientName}'s records.`);

  try {
    await batch.commit();
    console.log('\n--- ✅ Success! ---');
    console.log('Your virtual hospital data has been populated.');
    console.log('You can now log in with each user to test the interconnected workflow.');
  } catch (error) {
    console.error('--- ❌ Error committing batch ---');
    console.error(error);
  }
}

populateVirtualHospital();
