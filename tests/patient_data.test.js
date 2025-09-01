// Jest test for validating patient data and relationships
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Patient Data Integrity', () => {
  const patientUid = 'sgVCAWk1MdQWeWd9GTFYKPmwJz02'; // John Doe

  test(
    'Patient has appointment, lab test, prescription, medical record, imaging result, and vitals',
    async () => {
      // Appointment
      const appointments = await db.collection('appointments').where('patientUid', '==', patientUid).get();
      expect(appointments.size).toBeGreaterThan(0);

      // Lab Test
      const labTests = await db.collection('lab_tests').where('patientUid', '==', patientUid).get();
      expect(labTests.size).toBeGreaterThan(0);

      // Prescription
      const prescriptions = await db.collection('prescriptions').where('patientUid', '==', patientUid).get();
      expect(prescriptions.size).toBeGreaterThan(0);

      // Medical Record
      const medicalRecords = await db.collection('medical_records').where('patientUid', '==', patientUid).get();
      expect(medicalRecords.size).toBeGreaterThan(0);

      // Imaging Result
      const imagingResults = await db.collection('imaging_results').where('patientUid', '==', patientUid).get();
      expect(imagingResults.size).toBeGreaterThan(0);

      // Vitals
      const vitals = await db.collection('vitals').where('patientUid', '==', patientUid).get();
      expect(vitals.size).toBeGreaterThan(0);
    },
    20000 // 20 seconds timeout
  );
});
