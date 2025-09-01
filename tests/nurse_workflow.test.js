// Jest test for validating nurse workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Nurse Workflow Integrity', () => {
  const nurseUid = 'dOl8jmqXWGYi3f6j6dojObsXORv1';

  test(
    'Nurse has updated vitals for patients',
    async () => {
      const vitals = await db.collection('vitals').where('nurseUid', '==', nurseUid).get();
      expect(vitals.size).toBeGreaterThan(0);
    },
    20000
  );
});
