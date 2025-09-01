# 📖 Zizo_MediVerse Doctor UI Manual

This document provides a comprehensive guide to the user interface and functionalities available to users with the "Doctor" role within the Zizo_MediVerse platform.

---

## 1. Doctor's Console (Dashboard)

**Route:** `/doctor/dashboard`

The Doctor's Console is the central landing page and command center for all clinical activities. It is designed to provide an immediate, at-a-glance overview of the doctor's most critical daily tasks and patient statuses.

### Key Components:

- **Zizo's Briefing Card**:
  - **Purpose**: To provide a personalized, AI-generated summary of the day's agenda.
  - **Functionality**: On login, a Genkit flow analyzes the doctor's schedule and patient list to generate a natural language briefing. It highlights the number of appointments, new patient alerts, and flags any patients in critical condition.

- **Assigned Patients Table**:
  - **Purpose**: To display a real-time roster of all patients currently under the doctor's care.
  - **Functionality**: Fetches data from the `patients` collection where `assignedDoctor` matches the logged-in doctor's ID. It displays the patient's name, primary diagnosis, and their current condition, indicated by a color-coded badge (`Stable`, `Needs Monitoring`, `Critical`).

- **Upcoming Appointments Table**:
  - **Purpose**: To provide a clear view of the day's scheduled consultations.
  - **Functionality**: Fetches upcoming appointments for the doctor from the `appointments` sub-collection within patient records. It displays the scheduled time, patient name, and a (currently disabled) "Start" button intended to launch a consultation view.

- **Diagnostics Panel**:
  - **Purpose**: To serve as a quick launchpad for the advanced analysis tools.
  - **Functionality**: Contains direct links to the AI Diagnostics page, the 3D Organ Model viewer, and the Radiology Viewer, streamlining access to these powerful features.

- **Floating Action Buttons**:
  - **AI Tools**: Opens a multi-tabbed modal for summarizing medical history or getting AI-driven treatment suggestions.
  - **Write Prescription**: Opens a modal to create new prescriptions, complete with an AI notes generator.

---

## 2. Diagnostic Center

**Route:** `/doctor/diagnostics`

This page is the hub for advanced medical analysis, combining AI-driven insights with visual data exploration.

### Key Components:

- **AI-Powered Diagnostics Panel**:
  - **Purpose**: To assist in differential diagnosis.
  - **Functionality**: The doctor can input a patient's symptoms and medical history. This data is sent to the `diagnoseCondition` Genkit flow, which returns a structured response including a potential diagnosis, the rationale behind it, and recommended next steps (e.g., tests, referrals).

- **Radiology Image Viewer**:
  - **Purpose**: To provide a quick way to review patient scans.
  - **Functionality**: A horizontally scrolling carousel displays mock radiological images (X-Rays, MRIs, etc.). This is a placeholder for a future, more advanced DICOM viewer.

- **3D Anatomical Viewer**:
  - **Purpose**: To visualize patient anatomy in three dimensions.
  - **Functionality**: A placeholder card displays a 3D model (currently a static image). The intent is for this to be an interactive `react-three-fiber` component where doctors can toggle layers like skin, muscle, and skeleton.

---

## 3. Secure Messaging (Chat)

**Route:** `/chat`

This is a shared interface for real-time, secure communication between healthcare professionals and their patients.

### Key Components:

- **Contact List**:
  - **Functionality**: For a doctor, this list dynamically populates with all the patients currently assigned to them.
- **Chat Window**:
  - **Functionality**: A standard real-time messaging interface where conversations are stored in Firestore under a unique chat ID generated from the participants' UIDs.
