// Script to check for missing 'date_string' field in all 'appointments' collection group documents
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function checkMissingDateString() {
  const snapshot = await db.collectionGroup('appointments').get();
  let missingCount = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!('date_string' in data)) {
      console.log(`Missing 'date_string' in doc: ${doc.id} (path: ${doc.ref.path})`);
      missingCount++;
    }
  });
  console.log(`\nTotal documents missing 'date_string': ${missingCount}`);
}

checkMissingDateString().then(() => {
  process.exit(0);
});
