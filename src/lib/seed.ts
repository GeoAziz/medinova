
// 🔐 Requires: Firebase Admin SDK initialized with service account
/*
 * This script seeds the Firebase project with test data for all user roles.
 * It's designed to be idempotent, so it can be run multiple times without
 * creating duplicate users or data.
 */
import admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

const seedPassword = 'password123';

const testUsers = [
    { email: "admin@zizoverse.io", role: "admin", fullName: "SysAdmin Unit 734" },
    { email: "doctor@zizoverse.io", role: "doctor", fullName: "Dr. Evelyn Reed" },
    { email: "patient@zizoverse.io", role: "patient", fullName: "Alex Ryder" },
    { email: "nurse@zizoverse.io", role: "nurse", fullName: "Nurse Kai" },
    { email: "lab@zizoverse.io", role: "lab_scientist", fullName: "Lab Scientist 04" },
    { email: "pharmacist@zizoverse.io", role: "pharmacist", fullName: "Riya Singh" },
    { email: "receptionist@zizoverse.io", role: "receptionist", fullName: "Javier Rios" },
    { email: "radiologist@zizoverse.io", role: "radiologist", fullName: "Dr. Chloe Benali" },
    { email: "mro@zizoverse.io", role: "medical_records_officer", fullName: "Officer Z-X9" },
];

const specialties = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics"];
const departments = ["Medical", "Surgical", "Pediatrics", "Emergency", "Diagnostics"];
const shifts = ["Day (7am-7pm)", "Night (7pm-7am)", "Swing (12pm-12am)"];
const labTypes = ["Hematology", "Microbiology", "Clinical Chemistry", "Genetics"];
const imagingTypes = ["MRI", "CT Scan", "X-Ray", "Ultrasound"];
const wards = ["Cardiovascular Wing", "Neurology Unit", "Pediatric Ward", "General Medicine"];

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));


async function createUsersAndData() {
  console.log('--- Starting Data Seeding for Zizo_MediVerse ---');
  
  const userCreationPromises = testUsers.map(async (userData) => {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(userData.email);
      console.log(`✅ User already exists: ${userData.email}`);
    } catch (err) {
      userRecord = await auth.createUser({
        email: userData.email,
        password: seedPassword,
        displayName: userData.fullName,
      });
      console.log(`🚀 Created auth user: ${userData.email}`);
    }

    await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });
    console.log(`🔑 Set custom claim 'role: ${userData.role}' for ${userData.email}`);

    const userProfile = {
      uid: userRecord.uid,
      email: userRecord.email,
      role: userData.role,
      fullName: userData.fullName,
      profileImage: `https://placehold.co/128x128.png`,
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection("users").doc(userRecord.uid).set(userProfile, { merge: true });
    console.log(`👤 Set profile for ${userData.email} in /users collection.`);
    return { ...userData, uid: userRecord.uid };
  });

  const createdUsers = await Promise.all(userCreationPromises);

  // --- Seed specific records for our main test users ---
  const mainRecordPromises = createdUsers.map(async (user) => {
    if (user.role === 'doctor') {
      await db.collection('doctors').doc(user.uid).set({
        name: user.fullName,
        specialty: 'Cardiology',
        department: 'Medical',
        bio: "Lead Cardiologist at Zizo_MediVerse. Expert in cybernetic heart enhancements.",
        schedule: "Mon-Fri, 9am-5pm",
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
       console.log(`🩺 Created primary record for ${user.fullName}`);
    }
    if (user.role === 'patient') {
      await db.collection('patients').doc(user.uid).set({
        name: user.fullName,
        age: 28,
        gender: "Male",
        room: "Cryo-Pod 7",
        createdAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
       console.log(`❤️ Created primary record for ${user.fullName}`);
    }
    if (user.role === 'nurse') {
      await db.collection('nurses').doc(user.uid).set({
          name: user.fullName,
          ward: 'Cardiovascular Wing',
          shift: 'Day (7am-7pm)',
          imageURL: "https://placehold.co/200x200.png",
          createdAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
       console.log(`🩹 Created primary record for ${user.fullName}`);
    }
    if (user.role === 'lab_scientist') {
      await db.collection('labScientists').doc(user.uid).set({
          fullName: user.fullName,
          labType: 'Genetics',
          recentTests: 158,
          imageURL: "https://placehold.co/200x200.png",
          createdAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
      console.log(`🧪 Created primary record for ${user.fullName}`);
    }
     if (user.role === 'pharmacist') {
      await db.collection('pharmacists').doc(user.uid).set({
          fullName: user.fullName,
          prescriptionLogs: 320,
          medicinesAvailable: 4500,
          imageURL: "https://placehold.co/200x200.png",
          createdAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
      console.log(`💊 Created primary record for ${user.fullName}`);
    }
    if (user.role === 'receptionist') {
        await db.collection('receptionists').doc(user.uid).set({
            fullName: user.fullName,
            appointmentsHandled: 1250,
            incomingCalls: 2800,
            imageURL: "https://placehold.co/200x200.png",
            createdAt: admin.firestore.Timestamp.now(),
        }, { merge: true });
        console.log(`🤝 Created primary record for ${user.fullName}`);
    }
     if (user.role === 'radiologist') {
        await db.collection('radiologists').doc(user.uid).set({
            fullName: user.fullName,
            imagingTypes: 'MRI',
            scanReports: 550,
            imageURL: "https://placehold.co/200x200.png",
            createdAt: admin.firestore.Timestamp.now(),
        }, { merge: true });
        console.log(`☢️ Created primary record for ${user.fullName}`);
    }
    if (user.role === 'medical_records_officer') {
        await db.collection('medicalRecordsOfficers').doc(user.uid).set({
            fullName: user.fullName,
            recordAccessLogs: 300,
            reportsGenerated: 150,
            imageURL: "https://placehold.co/200x200.png",
            createdAt: admin.firestore.Timestamp.now(),
        }, { merge: true });
        console.log(`📁 Created primary record for ${user.fullName}`);
    }
  });

  await Promise.all(mainRecordPromises);


  // --- Seed additional random data ---
  const seedPromises = [
    seedCollection('doctors', 9, (i) => ({
      name: `Dr. ${getRandomItem(["Liam", "Olivia", "Noah", "Emma", "Oliver"])} ${getRandomItem(["Smith", "Johnson", "Williams", "Brown", "Jones"])}`,
      specialty: getRandomItem(specialties),
      department: getRandomItem(departments),
      bio: "A dedicated professional with over 10 years of experience.",
      schedule: "Mon-Fri, 9am-5pm",
      imageURL: "https://placehold.co/200x200.png",
      createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('patients', 9, (i) => ({
      name: `${getRandomItem(["Ava", "Isabella", "Sophia", "Mia", "Charlotte"])} ${getRandomItem(["Garcia", "Miller", "Davis", "Rodriguez", "Martinez"])}`,
      age: getRandomInt(18, 80),
      gender: getRandomItem(["Male", "Female", "Other"]),
      room: `Room ${getRandomInt(100, 500)}`,
      createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('nurses', 9, (i) => ({
        name: `Nurse ${getRandomItem(["James", "Mary", "John", "Patricia", "Robert"])} ${getRandomItem(["Wilson", "Anderson", "Thomas", "Taylor", "Moore"])}`,
        ward: getRandomItem(wards),
        shift: getRandomItem(shifts),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
     seedCollection('labScientists', 9, (i) => ({
        fullName: `Scientist ${getRandomItem(["David", "Jennifer", "Charles", "Linda", "Joseph"])} ${getRandomItem(["Jackson", "White", "Harris", "Martin", "Thompson"])}`,
        labType: getRandomItem(labTypes),
        recentTests: getRandomInt(50, 200),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('pharmacists', 9, (i) => ({
        fullName: `Pharmacist ${getRandomItem(["Susan", "William", "Jessica", "Richard", "Karen"])} ${getRandomItem(["Garcia", "Miller", "Davis", "Rodriguez", "Martinez"])}`,
        prescriptionLogs: getRandomInt(100, 500),
        medicinesAvailable: getRandomInt(2000, 5000),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('receptionists', 9, (i) => ({
        fullName: `${getRandomItem(["Betty", "Daniel", "Helen", "Paul", "Nancy"])} ${getRandomItem(["Lee", "Walker", "Hall", "Allen", "Young"])}`,
        appointmentsHandled: getRandomInt(500, 1500),
        incomingCalls: getRandomInt(1000, 3000),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
     seedCollection('radiologists', 9, (i) => ({
        fullName: `Radiologist ${getRandomItem(["Mark", "Sandra", "Steven", "Donna", "Kevin"])} ${getRandomItem(["King", "Wright", "Scott", "Green", "Adams"])}`,
        imagingTypes: getRandomItem(imagingTypes),
        scanReports: getRandomInt(200, 800),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('medicalRecordsOfficers', 9, (i) => ({
        fullName: `Officer ${getRandomItem(["Thomas", "Sarah", "Christopher", "Lisa", "Anthony"])} ${getRandomItem(["Clark", "Lewis", "Robinson", "Walker", "Perez"])}`,
        recordAccessLogs: getRandomInt(100, 500),
        reportsGenerated: getRandomInt(50, 200),
        imageURL: "https://placehold.co/200x200.png",
        createdAt: admin.firestore.Timestamp.fromDate(getRandomDate(new Date(2022, 0, 1), new Date())),
    })),
    seedCollection('systemLogs', 10, i => ({
      message: `System check complete. Module ${i + 1} nominal.`,
      level: i % 3 === 0 ? "ERROR" : i % 2 === 0 ? "WARN" : "INFO",
      timestamp: admin.firestore.Timestamp.fromMillis(Date.now() - (10 - i) * 60000),
    }))
  ];

  await Promise.all(seedPromises);

  console.log("🎉 All test users and data seeded successfully to Zizo_MediVerse!");
  console.log('--- Seeding Complete ---');
}

async function seedCollection(collectionName: string, count: number, dataFactory: (index: number) => any) {
  if (count <= 0) return;
  console.log(`\n- Seeding ${count} additional records into '${collectionName}'...`);
  const collectionRef = db.collection(collectionName);
  const batch = db.batch();
  for (let i = 0; i < count; i++) {
    const docRef = collectionRef.doc();
    batch.set(docRef, dataFactory(i));
  }
  await batch.commit();
  console.log(`- ✅ Seeded ${count} additional records into '${collectionName}'.`);
}


createUsersAndData().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});
