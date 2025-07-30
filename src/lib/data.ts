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
];

export const mockSystemLogs: SystemLog[] = [
  { id: 'log-01', timestamp: '2024-07-29 14:35:12', level: 'INFO', message: 'User PID-001 logged in successfully.' },
  { id: 'log-02', timestamp: '2024-07-29 14:30:05', level: 'WARN', message: 'High latency detected on appointment booking service.' },
  { id: 'log-03', timestamp: '2024-07-29 14:25:44', level: 'ERROR', message: 'Failed to process payment for appointment APT-089.' },
  { id: 'log-04', timestamp: '2024-07-29 14:20:19', level: 'INFO', message: 'Doctor application from Dr. Lena Petrova received.' },
];

export const mockAvailableDoctors = [
    { id: 'doc-01', name: 'Dr. Evelyn Reed', specialty: 'Cardiology', avatar: '/avatars/doctor-1.png' },
    { id: 'doc-02', name: 'Dr. Kenji Tanaka', specialty: 'Neurology', avatar: '/avatars/doctor-2.png' },
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
