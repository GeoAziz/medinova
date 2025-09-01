// Script to add sample patients to Firebase Authentication and Firestore
// Run with: node scripts/seed_patients.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const patients = [
  {
    name: 'John Doe',
    email: 'john.doe@zizoverse.io',
    dob: '1990-05-12',
    gender: 'M',
    address: '123 Main St',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@zizoverse.io',
    dob: '1985-11-23',
    gender: 'F',
    address: '456 Oak Ave',
  },
  {
    name: 'Ahmed Ali',
    email: 'ahmed.ali@zizoverse.io',
    dob: '1978-02-17',
    gender: 'M',
    address: '789 Pine Rd',
  },
  {
    name: 'Maria Lopez',
    email: 'maria.lopez@zizoverse.io',
    dob: '2001-07-30',
    gender: 'F',
    address: '321 Maple Blvd',
  },
  {
    name: 'Chen Wang',
    email: 'chen.wang@zizoverse.io',
    dob: '1969-09-05',
    gender: 'M',
    address: '654 Cedar St',
  },
  {
    name: 'Fatima Yusuf',
    email: 'fatima.yusuf@zizoverse.io',
    dob: '1995-03-14',
    gender: 'F',
    address: '987 Spruce Ln',
  },
  {
    name: 'David Kim',
    email: 'david.kim@zizoverse.io',
    dob: '1988-12-01',
    gender: 'M',
    address: '246 Elm St',
  },
  {
    name: 'Priya Singh',
    email: 'priya.singh@zizoverse.io',
    dob: '1975-06-22',
    gender: 'F',
    address: '135 Willow Dr',
  },
  {
    name: 'Luka Petrović',
    email: 'luka.petrovic@zizoverse.io',
    dob: '2003-04-18',
    gender: 'M',
    address: '753 Birch Ct',
  },
  {
    name: 'Amina Bello',
    email: 'amina.bello@zizoverse.io',
    dob: '1992-08-09',
    gender: 'F',
    address: '852 Aspen Way',
  },
];

async function addPatients() {
  for (const patient of patients) {
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: patient.email,
        password: 'password123',
        displayName: patient.name,
      });
      // Add patient profile to Firestore
      await db.collection('patients').doc(userRecord.uid).set({
        ...patient,
        uid: userRecord.uid,
        createdAt: new Date(),
      });
      console.log(`Added patient: ${patient.name} (${patient.email})`);
    } catch (error) {
      console.error(`Error adding ${patient.email}:`, error.message);
    }
  }
  process.exit();
}

addPatients();
