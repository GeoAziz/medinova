// Script to add 'date_string' field to all appointments missing it
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function fixMissingDateString() {
  const snapshot = await db.collectionGroup('appointments').get();
  let fixedCount = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!('date_string' in data)) {
      // Try to infer date_string from other fields, fallback to today
      let dateString = '';
      if (data.date) {
        // If date is a Firestore Timestamp, convert to string
        if (typeof data.date === 'object' && data.date.toDate) {
          dateString = data.date.toDate().toISOString().split('T')[0];
        } else {
          dateString = String(data.date);
        }
      } else {
        dateString = new Date().toISOString().split('T')[0];
      }
      await doc.ref.update({ date_string: dateString });
      console.log(`Added 'date_string' to doc: ${doc.id} (path: ${doc.ref.path}) value: ${dateString}`);
      fixedCount++;
    }
  }
  console.log(`\nTotal documents updated with 'date_string': ${fixedCount}`);
}

fixMissingDateString().then(() => {
  process.exit(0);
});
