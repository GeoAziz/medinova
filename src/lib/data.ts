
export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Past' | 'Cancelled';
};

export type Prescription = {
  id: string;
  medication: string;
  doctor: string;
  date: string;
  dosage: string;
  pdfUrl: string;
};

export type MedicalRecord = {
  id: string;
  date: string;
  title: string;
  summary: string;
};

export type DoctorApplication = {
  id: string;
  name: string;
  specialty: string;
  date: string;
  status: 'Pending';
};

export type SystemLog = {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
};

export type LabTest = {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  requestingDoctor: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  receivedDate: string;
};

export type NurseTask = {
    id: string;
    patientName: string;
    patientRoom: string;
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    isCompleted: boolean;
};

export type PharmacistPrescription = {
    id: string;
    patientName: string;
    patientId: string;
    medication: string;
    dosage: string;
    requestingDoctor: string;
    status: 'Pending' | 'Ready for Pickup' | 'Out of Stock' | 'Fulfilled';
    receivedDate: string;
};

export type PharmacistInventoryItem = {
    id: string;
    medicationName: string;
    ndc: string; // National Drug Code
    quantity: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    lastRestock: string;
};

export type ReceptionistAppointment = {
    id: string;
    patientName: string;
    doctorName: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'Arrived' | 'Checked-in' | 'Cancelled';
};

export type ScanRequest = {
    id: string;
    patientName: string;
    patientId: string;
    scanType: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound';
    requestingDoctor: string;
    status: 'Pending' | 'Reviewed' | 'Needs Re-scan';
    requestDate: string;
    imageUrl: string;
};

export type RecordAccessRequest = {
    id: string;
    requestingUser: string;
    requestingRole: 'Doctor' | 'Specialist' | 'Auditor';
    patientId: string;
    patientName: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Denied';
    date: string;
};

export const mockMedicalRecordsOfficer = {
    name: 'Officer Z-X9',
    id: 'MRO-001',
};

export const mockAccessRequests: RecordAccessRequest[] = [
    { id: 'REQ-001', requestingUser: 'Dr. Kenji Tanaka', requestingRole: 'Doctor', patientId: 'PID-001', patientName: 'Alex Ryder', reason: 'Follow-up consultation.', status: 'Pending', date: '2024-08-10' },
    { id: 'REQ-002', requestingUser: 'Dr. Anya Sharma', requestingRole: 'Doctor', patientId: 'PID-004', patientName: 'Zara Al-Jamil', reason: 'Review of recent dermatological scan.', status: 'Approved', date: '2024-08-09' },
    { id: 'REQ-003', requestingUser: 'External Auditor', requestingRole: 'Auditor', patientId: 'PID-008', patientName: 'Leo Carter', reason: 'Routine compliance check.', status: 'Approved', date: '2024-08-08' },
    { id: 'REQ-004', requestingUser: 'Dr. Lena Petrova', requestingRole: 'Specialist', patientId: 'PID-012', patientName: 'Sofia Rossi', reason: 'Pediatric surgical consult.', status: 'Denied', date: '2024-08-07' },
];

export const mockRadiologist = {
    name: 'Dr. Chloe Benali',
    id: 'RADIO-001',
};

export const mockScanRequests: ScanRequest[] = [
    { id: 'SCAN-001', patientName: 'Alex Ryder', patientId: 'PID-001', scanType: 'CT Scan', requestingDoctor: 'Dr. Kenji Tanaka', status: 'Pending', requestDate: '2024-08-05', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 'SCAN-002', patientName: 'Jasmine Lee', patientId: 'PID-002', scanType: 'X-Ray', requestingDoctor: 'Dr. Ben Carter', status: 'Pending', requestDate: '2024-08-05', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 'SCAN-003', patientName: 'Marcus Thorne', patientId: 'PID-003', scanType: 'MRI', requestingDoctor: 'Dr. Kenji Tanaka', status: 'Reviewed', requestDate: '2024-08-04', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 'SCAN-004', patientName: 'Zara Al-Jamil', patientId: 'PID-004', scanType: 'X-Ray', requestingDoctor: 'Dr. Evelyn Reed', status: 'Reviewed', requestDate: '2024-08-04', imageUrl: 'https://placehold.co/600x400.png' },
    { id: 'SCAN-005', patientName: 'Leo Carter', patientId: 'PID-008', scanType: 'Ultrasound', requestingDoctor: 'Dr. Anya Sharma', status: 'Needs Re-scan', requestDate: '2024-08-03', imageUrl: 'https://placehold.co/600x400.png' },
];

export const mockReceptionist = {
    name: 'Javier "Jay" Rios',
    id: 'RECEP-001',
};

export const mockReceptionistAppointments: ReceptionistAppointment[] = [
    { id: 'apt-r-01', patientName: 'Alex Ryder', doctorName: 'Dr. Evelyn Reed', time: '10:30 AM', status: 'Confirmed' },
    { id: 'apt-r-02', patientName: 'Jasmine Lee', doctorName: 'Dr. Kenji Tanaka', time: '11:00 AM', status: 'Confirmed' },
    { id: 'apt-r-03', patientName: 'Marcus Thorne', doctorName: 'Dr. Evelyn Reed', time: '11:30 AM', status: 'Arrived' },
    { id: 'apt-r-04', patientName: 'Zara Al-Jamil', doctorName: 'Dr. Anya Sharma', time: '01:00 PM', status: 'Confirmed' },
    { id: 'apt-r-05', patientName: 'Leo Carter', doctorName: 'Dr. Ben Carter', time: '01:30 PM', status: 'Checked-in' },
    { id: 'apt-r-06', patientName: 'Sofia Rossi', doctorName: 'Dr. Kenji Tanaka', time: '02:00 PM', status: 'Cancelled' },
];

export const mockPatient = {
  name: 'Alex Ryder',
  id: 'PID-001',
};

export const mockAppointments: Appointment[] = [
  { id: 'apt-001', doctor: 'Dr. Evelyn Reed', specialty: 'Cardiology', date: '2024-08-15', time: '10:30 AM', status: 'Upcoming' },
  { id: 'apt-002', doctor: 'Dr. Kenji Tanaka', specialty: 'Neurology', date: '2024-07-20', time: '02:00 PM', status: 'Upcoming' },
  { id: 'apt-003', doctor: 'Dr. Anya Sharma', specialty: 'Dermatology', date: '2024-06-10', time: '11:00 AM', status: 'Past' },
];

export const mockPrescriptions: Prescription[] = [
  { id: 'pre-001', medication: 'Nebivolol', doctor: 'Dr. Evelyn Reed', date: '2024-05-20', dosage: '5mg, once daily', pdfUrl: '#' },
  { id: 'pre-002', medication: 'Sumatriptan', doctor: 'Dr. Kenji Tanaka', date: '2024-04-15', dosage: '50mg, as needed', pdfUrl: '#' },
];

export const mockMedicalHistory: MedicalRecord[] = [
  { id: 'rec-001', date: '2024-05-20', title: 'Cardiology Check-up', summary: 'Routine check-up. ECG normal. Blood pressure slightly elevated. Prescribed Nebivolol.' },
  { id: 'rec-002', date: '2024-04-15', title: 'Neurology Consultation', summary: 'Patient reported frequent migraines. Discussed triggers and lifestyle adjustments. Prescribed Sumatriptan for acute attacks.' },
  { id: 'rec-003', date: '2023-11-02', title: 'Annual Physical Exam', summary: 'All vitals stable. Standard blood work results within normal ranges. No acute issues reported.' },
];

export const mockDoctor = {
  name: 'Dr. Evelyn Reed',
  specialty: 'Cardiology',
};

export const mockDoctorPatients = [
  { id: 'PID-001', name: 'Alex Ryder', lastAppointment: '2024-08-15' },
  { id: 'PID-002', name: 'Jasmine Lee', lastAppointment: '2024-08-12' },
  { id: 'PID-003', name: 'Marcus Thorne', lastAppointment: '2024-08-10' },
  { id: 'PID-004', name: 'Zara Al-Jamil', lastAppointment: '2024-07-30' },
];

export const mockDoctorSchedule = [
  { time: '09:00 AM', patient: 'Jasmine Lee', type: 'Follow-up' },
  { time: '10:30 AM', patient: 'Alex Ryder', type: 'Consultation' },
  { time: '02:00 PM', patient: 'Marcus Thorne', type: 'Annual Check-up' },
];

export const mockAdmin = {
  name: 'SysAdmin Unit 734',
};

export const mockDoctorApplications: DoctorApplication[] = [
    { id: 'doc-app-01', name: 'Dr. Lena Petrova', specialty: 'Pediatrics', date: '2024-07-28', status: 'Pending' },
    { id: 'doc-app-02', name: 'Dr. Samuel Chen', specialty: 'Oncology', date: '2024-07-27', status: 'Pending' },
];

export const mockUserList = [
    { id: 'usr-001', name: 'Alex Ryder', role: 'Patient', registered: '2023-01-15' },
    { id: 'usr-002', name: 'Dr. Evelyn Reed', role: 'Doctor', registered: '2022-11-20' },
    { id: 'usr-003', name: 'Jasmine Lee', role: 'Patient', registered: '2023-03-10' },
    { id: 'usr-004', name: 'Dr. Kenji Tanaka', role: 'Doctor', registered: '2023-02-01' },
    { id: 'usr-005', name: 'SysAdmin Unit 734', role: 'Admin', registered: '2022-01-01' },
    { id: 'usr-006', name: 'Lab Scientist 04', role: 'Lab Scientist', registered: '2023-05-01' },
    { id: 'usr-007', name: 'Nurse Kai', role: 'Nurse', registered: '2023-04-12' },
    { id: 'usr-008', name: 'Riya Singh', role: 'Pharmacist', registered: '2023-06-01' },
    { id: 'usr-009', name: 'Javier Rios', role: 'Receptionist', registered: '2023-07-01' },
    { id: 'usr-010', name: 'Dr. Chloe Benali', role: 'Radiologist', registered: '2023-08-01' },
    { id: 'usr-011', name: 'Officer Z-X9', role: 'Medical Records Officer', registered: '2023-09-01' },
];

export const mockSystemLogs: SystemLog[] = [
  { id: 'log-01', timestamp: '2024-07-29 14:35:12', level: 'INFO', message: 'User PID-001 logged in successfully.' },
  { id: 'log-02', timestamp: '2024-07-29 14:30:05', level: 'WARN', message: 'High latency detected on appointment booking service.' },
  { id: 'log-03', timestamp: '2024-07-29 14:25:44', level: 'ERROR', message: 'Failed to process payment for appointment APT-089.' },
  { id: 'log-04', timestamp: '2024-07-29 14:20:19', level: 'INFO', message: 'Doctor application from Dr. Lena Petrova received.' },
];

export const mockAvailableDoctors = [
    { id: 'doc-01', name: 'Dr. Evelyn Reed', specialty: 'Cardiology', avatar: '/avatars/doctor-1.png' },
    { id: 'doc-02', name: 'Dr. Kenji Tanaka', specialty: 'Neurology', avatar: '/avatars/doctor-3.png' },
    { id: 'doc-03', name: 'Dr. Anya Sharma', specialty: 'Dermatology', avatar: '/avatars/doctor-3.png' },
    { id: 'doc-04', name: 'Dr. Ben Carter', specialty: 'Orthopedics', avatar: '/avatars/doctor-4.png' },
];

export const mockChatContacts = [
    { id: 'chat-01', name: 'Dr. Evelyn Reed', status: 'Online', lastMessage: 'See you on the 15th!', unread: 0 },
    { id: 'chat-02', name: 'Dr. Kenji Tanaka', status: 'Offline', lastMessage: 'Let me know if the headaches persist.', unread: 1 },
    { id: 'chat-03', name: 'Support Bot', status: 'Online', lastMessage: 'How can I help you today?', unread: 0 },
]

export const mockChatMessages = [
    { id: 'msg-01', sender: 'other', text: 'Hello Alex, just checking in on your prescription.', time: '10:30 AM' },
    { id: 'msg-02', sender: 'me', text: 'Hi Dr. Reed! Everything is going well, thank you.', time: '10:31 AM' },
    { id: 'msg-03', sender: 'other', text: 'Excellent. Remember to monitor your blood pressure. We\'ll discuss it at your next appointment.', time: '10:32 AM' },
    { id: 'msg-04', sender: 'me', text: 'Will do. See you on the 15th!', time: '10:33 AM' },
]

export const mockLabTests: LabTest[] = [
    { id: 'LT-001', patientName: 'Alex Ryder', patientId: 'PID-001', testType: 'Complete Blood Count', requestingDoctor: 'Dr. Evelyn Reed', status: 'Pending', receivedDate: '2024-07-30' },
    { id: 'LT-002', patientName: 'Jasmine Lee', patientId: 'PID-002', testType: 'Lipid Panel', requestingDoctor: 'Dr. Evelyn Reed', status: 'Pending', receivedDate: '2024-07-30' },
    { id: 'LT-003', patientName: 'Marcus Thorne', patientId: 'PID-003', testType: 'Thyroid Panel', requestingDoctor: 'Dr. Kenji Tanaka', status: 'In Progress', receivedDate: '2024-07-29' },
    { id: 'LT-004', patientName: 'Zara Al-Jamil', patientId: 'PID-004', testType: 'Glucose Tolerance Test', requestingDoctor: 'Dr. Anya Sharma', status: 'Completed', receivedDate: '2024-07-28' },
    { id: 'LT-005', patientName: 'Leo Carter', patientId: 'PID-008', testType: 'Tissue Biopsy', requestingDoctor: 'Dr. Ben Carter', status: 'Completed', receivedDate: '2024-07-27' },
    { id: 'LT-006', patientName: 'Sofia Rossi', patientId: 'PID-012', testType: 'Urinalysis', requestingDoctor: 'Dr. Evelyn Reed', status: 'Rejected', receivedDate: '2024-07-26' },
];

export const mockNurseAssignedPatients = [
  { id: 'PID-001', name: 'Alex Ryder', room: '301-A', condition: 'Stable', vitals: { hr: 72, bp: '120/80', temp: 36.8 } },
  { id: 'PID-003', name: 'Marcus Thorne', room: '301-B', condition: 'Needs Monitoring', vitals: { hr: 85, bp: '130/85', temp: 37.1 } },
  { id: 'PID-008', name: 'Leo Carter', room: '302-A', condition: 'Critical', vitals: { hr: 110, bp: '150/95', temp: 38.5 } },
  { id: 'PID-012', name: 'Sofia Rossi', room: '304-B', condition: 'Stable', vitals: { hr: 68, bp: '115/75', temp: 36.7 } },
];

export const mockNurseTasks: NurseTask[] = [
    { id: 'task-01', patientName: 'Leo Carter', patientRoom: '302-A', task: 'Administer IV antibiotics', priority: 'High', isCompleted: false },
    { id: 'task-02', patientName: 'Marcus Thorne', patientRoom: '301-B', task: 'Check vitals', priority: 'Medium', isCompleted: false },
    { id: 'task-03', patientName: 'Alex Ryder', patientRoom: '301-A', task: 'Administer morning medication', priority: 'Low', isCompleted: false },
    { id: 'task-04', patientName: 'Leo Carter', patientRoom: '302-A', task: 'Draw blood for lab test', priority: 'High', isCompleted: false },
    { id: 'task-05', patientName: 'Sofia Rossi', patientRoom: '304-B', task: 'Assist with ambulation', priority: 'Low', isCompleted: true },
];

export const mockPharmacist = {
    name: 'Riya Singh',
    id: 'PHARM-001',
};

export const mockPharmacistPrescriptions: PharmacistPrescription[] = [
    { id: 'RX-001', patientName: 'Alex Ryder', patientId: 'PID-001', medication: 'Nebivolol 5mg', dosage: '1 tablet daily', requestingDoctor: 'Dr. Evelyn Reed', status: 'Pending', receivedDate: '2024-08-01 09:15 AM' },
    { id: 'RX-002', patientName: 'Jasmine Lee', patientId: 'PID-002', medication: 'Atorvastatin 20mg', dosage: '1 tablet daily', requestingDoctor: 'Dr. Evelyn Reed', status: 'Pending', receivedDate: '2024-08-01 09:30 AM' },
    { id: 'RX-003', patientName: 'Marcus Thorne', patientId: 'PID-003', medication: 'Levothyroxine 50mcg', dosage: '1 tablet daily', requestingDoctor: 'Dr. Kenji Tanaka', status: 'Ready for Pickup', receivedDate: '2024-08-01 08:45 AM' },
    { id: 'RX-004', patientName: 'Leo Carter', patientId: 'PID-008', medication: 'Amoxicillin 500mg', dosage: '1 tablet every 8 hours', requestingDoctor: 'Dr. Ben Carter', status: 'Out of Stock', receivedDate: '2024-08-01 10:00 AM' },
    { id: 'RX-005', patientName: 'Zara Al-Jamil', patientId: 'PID-004', medication: 'Metformin 1000mg', dosage: '1 tablet twice daily', requestingDoctor: 'Dr. Anya Sharma', status: 'Fulfilled', receivedDate: '2024-07-31 04:20 PM' },
];

export const mockPharmacistInventory: PharmacistInventoryItem[] = [
    { id: 'DRG-001', medicationName: 'Nebivolol 5mg', ndc: '0093-7478-01', quantity: 250, status: 'In Stock', lastRestock: '2024-07-15' },
    { id: 'DRG-002', medicationName: 'Atorvastatin 20mg', ndc: '0378-7171-92', quantity: 400, status: 'In Stock', lastRestock: '2024-07-20' },
    { id: 'DRG-003', medicationName: 'Levothyroxine 50mcg', ndc: '0054-0014-25', quantity: 80, status: 'Low Stock', lastRestock: '2024-06-28' },
    { id: 'DRG-004', medicationName: 'Amoxicillin 500mg', ndc: '0781-1598-01', quantity: 0, status: 'Out of Stock', lastRestock: '2024-07-05' },
    { id: 'DRG-005', medicationName: 'Metformin 1000mg', ndc: '51079-052-20', quantity: 1500, status: 'In Stock', lastRestock: '2024-07-22' },
];
