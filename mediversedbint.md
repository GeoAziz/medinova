# 📘 Zizo_MediVerse DB Interaction Manual

This document defines how all authenticated roles interact with the Firestore database in the Zizo_MediVerse ecosystem. It outlines collection structures and role-based permissions (CRUD operations).

---

## 🔑 Core Concepts

- **Authentication**: User identity is managed by Firebase Authentication. The `uid` is the primary key linking a user to their data.
- **Authorization**: Firestore Security Rules are used to enforce the permissions described below, ensuring users can only access the data appropriate for their role.
- **User Roles**: The primary user role is stored in a `users` collection, which is the source of truth for access control.

---

## 🗂️ Firestore Collection Structure

```
/users/{userId}
  - email: string
  - name: string
  - role: 'patient' | 'doctor' | 'admin' | 'nurse' | 'lab_scientist' | 'pharmacist' | 'receptionist' | 'radiologist' | 'medical_records_officer'
  - assigned_facility_id: string (optional)

/patients/{patientId}
  - user_id: string (links to /users/{userId})
  - personal_info: object
  /medical_history/{recordId}
    - date: timestamp
    - title: string
    - summary: string
    - doctor_id: string
  /prescriptions/{prescriptionId}
    - medication: string
    - dosage: string
    - status: 'active' | 'fulfilled'
    - doctor_id: string
  /appointments/{appointmentId}
    - date: timestamp
    - doctor_id: string
    - status: 'scheduled' | 'completed' | 'cancelled'
  /scans/{scanId}
    - scan_type: string
    - status: 'pending_review' | 'reviewed'
    - image_url: string
    - report: string (optional)
  /lab_tests/{testId}
    - test_type: string
    - status: 'pending' | 'completed'
    - results: object

/doctors/{doctorId}
  - user_id: string
  - name: string
  - specialty: string

/clinics/{clinicId}
  - name: string
  - location: string
  - staff: array<string> (staff userIds)

/inventory/{itemId}
  - medication_name: string
  - quantity: number
  - status: 'in_stock' | 'low_stock' | 'out_of_stock'

/access_requests/{requestId}
  - patient_id: string
  - requesting_user_id: string
  - reason: string
  - status: 'pending' | 'approved' | 'denied'

/audit_logs/{logId}
  - timestamp: timestamp
  - user_id: string
  - action: string (e.g., 'viewed_record', 'released_data')
  - patient_id: string
  - details: string
```

---

## 👤 Role-Based Permissions

### 1. Patient
- **`users`**: `Read` their own document. `Update` their own profile info.
- **`patients/{patientId}`**: `Read` their own sub-collections (`medical_history`, `prescriptions`, `appointments`, `scans`, `lab_tests`).
- **`appointments`**: `Create` new appointments for themselves.

### 2. Doctor
- **`users`**: `Read` their own document.
- **`patients/{patientId}`**: `Read` data for patients assigned to them. `Create` and `Update` records in `medical_history`, `prescriptions`, `scans`, and `lab_tests`.
- **`appointments`**: `Read` appointments they are part of. `Update` appointment status.

### 3. Admin
- **`users`**: `Read`, `Create`, `Update`, `Delete` all user documents (for role assignment).
- **`clinics`**: `Read`, `Create`, `Update`, `Delete` all clinic documents.
- **`doctors`**: `Read`, `Create`, `Update`, `Delete` all doctor profiles.
- Has read-only access to most other collections for oversight.

### 4. Nurse
- **`patients/{patientId}`**: `Read` data for patients in their assigned ward/clinic. `Update` specific fields like vitals or notes in `medical_history`.
- **`appointments`**: `Read` appointments for their assigned patients.
- **`lab_tests`**: `Create` new lab test requests on behalf of a doctor.

### 5. Lab Scientist
- **`lab_tests`**: `Read` all test requests. `Update` the status and results of tests.
- **`patients/{patientId}`**: `Read` minimal patient identifying information linked to a test. No access to full medical history.

### 6. Pharmacist
- **`prescriptions`**: `Read` all prescriptions. `Update` the status of prescriptions (e.g., 'fulfilled', 'pending').
- **`inventory`**: `Read`, `Create`, `Update` medication stock levels.
- **`patients/{patientId}`**: `Read` patient information relevant to a prescription (e.g., name, allergies).

### 7. Receptionist
- **`appointments`**: `Read` all appointments for their facility. `Create` new appointments. `Update` status (e.g., 'checked-in', 'cancelled').
- **`patients`**: `Create` new patient documents. `Read`/`Update` basic demographic information for registration.

### 8. Radiologist
- **`scans`**: `Read` all scan requests. `Update` scan documents with a report and change status to 'reviewed'.
- **`patients/{patientId}`**: `Read` minimal patient identifying information linked to a scan.

### 9. Medical Records Officer
- **`patients/{patientId}`**: `Read` all patient data across all sub-collections.
- **`access_requests`**: `Read`, `Create`, `Update` all access requests.
- **`audit_logs`**: `Read`, `Create` all audit log entries. This collection is immutable for all other roles.
- The MRO has the highest level of read access for auditing but limited write access to prevent data tampering.
```