







export type User = {
    uid: string;
    email: string;
    role: string;
    fullName: string;
    profileImage: string;
    createdAt: any;
}

export type ChatContact = {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
  avatar: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  room: string;
  ward?: string;
  condition?: string;
  vitals?: { hr: number; bp: string; temp: number };
  nationalId?: string;
  diagnosis?: string;
  status?: string;
  assignedDoctor?: string;
  notes?: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
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

export type RecordAccessRequest = {
  id: string;
  requestingUserName: string;
  requestingUserRole: string;
  patientId: string;
  patientName: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  date: string;
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

export type ScanRequest = {
    id: string;
    patientName: string;
    patientId: string;
    scanType: string;
    requestingDoctor: string;
    status: 'Pending' | 'Reviewed' | 'Needs Re-scan';
    requestDate: string;
    imageUrl: string;
};
