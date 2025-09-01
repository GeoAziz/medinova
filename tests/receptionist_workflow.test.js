// Jest test for validating receptionist workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Receptionist Workflow Integrity', () => {
  const receptionistUid = '5W4kdRDn5IYygoBoIxoUC568HV62';

  test(
    'Receptionist has scheduled appointments for patients',
    async () => {
      const appointments = await db.collection('appointments').where('receptionistUid', '==', receptionistUid).get();
      expect(appointments.size).toBeGreaterThan(0);
    },
    20000
  );
});
