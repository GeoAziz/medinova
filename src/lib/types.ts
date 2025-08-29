


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
