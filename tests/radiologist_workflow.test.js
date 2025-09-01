// Jest test for validating radiologist workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Radiologist Workflow Integrity', () => {
  const radiologistUid = 'qpQPcG5A1aWzQM33ssrsy1JC18B2';

  test(
    'Radiologist has uploaded imaging results for patients',
    async () => {
      const imagingResults = await db.collection('imaging_results').where('radiologistUid', '==', radiologistUid).get();
      expect(imagingResults.size).toBeGreaterThan(0);
    },
    20000
  );
});
