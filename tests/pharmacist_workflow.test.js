// Jest test for validating pharmacist workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Pharmacist Workflow Integrity', () => {
  const pharmacistUid = '67PEkKHvcTTI0RQod2UIV3xDdfs2';

  test(
    'Pharmacist has dispensed medication for patients',
    async () => {
      const prescriptions = await db.collection('prescriptions').where('pharmacistUid', '==', pharmacistUid).get();
      expect(prescriptions.size).toBeGreaterThan(0);
    },
    20000
  );
});
