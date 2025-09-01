// Jest test for validating medical records officer workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Medical Records Officer Workflow Integrity', () => {
  const mroUid = 'Tug6RAd11NWKFMp97DjFoYjiet53';

  test(
    'Medical records officer has verified medical records for patients',
    async () => {
      const medicalRecords = await db.collection('medical_records').where('mroUid', '==', mroUid).get();
      expect(medicalRecords.size).toBeGreaterThan(0);
    },
    20000
  );
});
