// Script to seed interconnected medical records for all user roles
// Run with: node scripts/seed_interconnected_data.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// UIDs for users (replace with actual UIDs from your system)
const users = {
  patients: [
    { name: 'Amina Bello', uid: 'jLBn04QiRth7fiYOkUWmFSHKhog1' },
    { name: 'Luka Petrović', uid: '5amNpWEf2UV18iCE6iL5mMbV8BI2' },
    { name: 'Priya Singh', uid: 'iwrvVRyYLGgYwZ7YPeGA0307wUh1' },
    { name: 'David Kim', uid: 'iEzAC0p3DiQiR8ntlt9CVqdsTrz2' },
    { name: 'Fatima Yusuf', uid: '9z7jBGEJcnVYTFukxkZ4Dugmo9l2' },
    { name: 'Chen Wang', uid: 'PZs72W0yW8ZyC2cqA7R1qyeJ83J3' },
    { name: 'Maria Lopez', uid: 'iYCB0Bu2DebJDKbyEdFoaLObi0a2' },
    { name: 'Ahmed Ali', uid: '4UiLwmvM53PodA1EzVP8IPSbtCl2' },
    { name: 'Jane Smith', uid: 'qi5JQSVsYrWlSjg5vL0uEcqDe4i2' },
    { name: 'John Doe', uid: 'sgVCAWk1MdQWeWd9GTFYKPmwJz02' },
  ],
  doctor: { name: 'Doctor', uid: 'u1ib6mEJwuOWhGibuX7BroCInpD2' },
  nurse: { name: 'Nurse', uid: 'dOl8jmqXWGYi3f6j6dojObsXORv1' },
  labScientist: { name: 'Lab Scientist', uid: 'Ahjlp1RbKXMzQYjs5Aa5SWAtzC83' },
  pharmacist: { name: 'Pharmacist', uid: '67PEkKHvcTTI0RQod2UIV3xDdfs2' },
  radiologist: { name: 'Radiologist', uid: 'qpQPcG5A1aWzQM33ssrsy1JC18B2' },
  receptionist: { name: 'Receptionist', uid: '5W4kdRDn5IYygoBoIxoUC568HV62' },
  mro: { name: 'Medical Records Officer', uid: 'Tug6RAd11NWKFMp97DjFoYjiet53' },
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedData() {
  for (const patient of users.patients) {
    // 1. Create appointment
    const appointmentRef = db.collection('appointments').doc();
    const appointment = {
      patientUid: patient.uid,
      doctorUid: users.doctor.uid,
      nurseUid: users.nurse.uid,
      receptionistUid: users.receptionist.uid,
      date: randomDate(new Date(2025, 8, 1), new Date(2025, 8, 30)),
      reason: 'General Checkup',
      status: 'completed',
    };
    await appointmentRef.set(appointment);

    // 2. Create lab test request
    const labTestRef = db.collection('lab_tests').doc();
    const labTest = {
      patientUid: patient.uid,
      doctorUid: users.doctor.uid,
      labScientistUid: users.labScientist.uid,
      appointmentId: appointmentRef.id,
      testType: 'Blood Panel',
      requestedAt: appointment.date,
      result: {
        value: 'Normal',
        uploadedAt: randomDate(appointment.date, new Date(2025, 8, 30)),
        labScientistUid: users.labScientist.uid,
      },
    };
    await labTestRef.set(labTest);

    // 3. Create prescription
    const prescriptionRef = db.collection('prescriptions').doc();
    const prescription = {
      patientUid: patient.uid,
      doctorUid: users.doctor.uid,
      pharmacistUid: users.pharmacist.uid,
      appointmentId: appointmentRef.id,
      medication: 'Paracetamol',
      dosage: '500mg',
      instructions: 'Take twice daily after meals',
      dispensed: true,
      dispensedAt: randomDate(appointment.date, new Date(2025, 8, 30)),
    };
    await prescriptionRef.set(prescription);

    // 4. Create medical record
    const recordRef = db.collection('medical_records').doc();
    const medicalRecord = {
      patientUid: patient.uid,
      doctorUid: users.doctor.uid,
      mroUid: users.mro.uid,
      appointmentId: appointmentRef.id,
      diagnosis: 'Healthy',
      notes: 'No issues found during checkup.',
      createdAt: appointment.date,
    };
    await recordRef.set(medicalRecord);

    // 5. Create imaging result
    const imagingRef = db.collection('imaging_results').doc();
    const imagingResult = {
      patientUid: patient.uid,
      radiologistUid: users.radiologist.uid,
      appointmentId: appointmentRef.id,
      imageType: 'X-Ray',
      result: 'Clear',
      uploadedAt: randomDate(appointment.date, new Date(2025, 8, 30)),
    };
    await imagingRef.set(imagingResult);

    // 6. Nurse updates vitals
    const vitalsRef = db.collection('vitals').doc();
    const vitals = {
      patientUid: patient.uid,
      nurseUid: users.nurse.uid,
      appointmentId: appointmentRef.id,
      temperature: 36.7,
      bloodPressure: '120/80',
      updatedAt: randomDate(appointment.date, new Date(2025, 8, 30)),
    };
    await vitalsRef.set(vitals);

    console.log(`Seeded data for patient: ${patient.name}`);
  }
  process.exit();
}

seedData();
