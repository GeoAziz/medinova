// Jest test for validating doctor workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Doctor Workflow Integrity', () => {
  const doctorUid = 'u1ib6mEJwuOWhGibuX7BroCInpD2';

  test(
    'Doctor has created appointments, requested lab tests, and prescribed medication',
    async () => {
      // Appointments
      const appointments = await db.collection('appointments').where('doctorUid', '==', doctorUid).get();
      expect(appointments.size).toBeGreaterThan(0);

      // Lab Tests
      const labTests = await db.collection('lab_tests').where('doctorUid', '==', doctorUid).get();
      expect(labTests.size).toBeGreaterThan(0);

      // Prescriptions
      const prescriptions = await db.collection('prescriptions').where('doctorUid', '==', doctorUid).get();
      expect(prescriptions.size).toBeGreaterThan(0);
    },
    20000 // 20 seconds timeout
  );
});
