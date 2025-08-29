

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
