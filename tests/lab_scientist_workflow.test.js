// Jest test for validating lab scientist workflow
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

describe('Lab Scientist Workflow Integrity', () => {
  const labScientistUid = 'Ahjlp1RbKXMzQYjs5Aa5SWAtzC83';

  test(
    'Lab scientist has uploaded lab results for patients',
    async () => {
      const labTests = await db.collection('lab_tests').where('labScientistUid', '==', labScientistUid).get();
      expect(labTests.size).toBeGreaterThan(0);
    },
    20000
  );
});
