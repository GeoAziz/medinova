
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SendHorizonal, Search, Loader2, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getChatContacts, sendMessage } from '@/lib/actions/chat.actions';
import type { ChatContact, ChatMessage } from '@/lib/types';


export default function ChatPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
    const [newMessage, setNewMessage] = useState('');

    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Effect to get current user
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                // Handle user not logged in
                setLoadingContacts(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Effect to fetch contacts when user is available
    useEffect(() => {
        if (!user) return;
        
        const fetchContacts = async () => {
            setLoadingContacts(true);
            try {
                const fetchedContacts = await getChatContacts(user.uid);
                setContacts(fetchedContacts);
                if (fetchedContacts.length > 0) {
                    setActiveContact(fetchedContacts[0]);
                }
            } catch (error) {
                toast({ variant: 'destructive', title: 'Failed to load contacts.' });
            } finally {
                setLoadingContacts(false);
            }
        };

        fetchContacts();
    }, [user, toast]);

     // Effect to subscribe to messages for the active chat
    useEffect(() => {
        if (!user || !activeContact) {
            setMessages([]);
            return;
        };

        setLoadingMessages(true);
        const db = getFirestore(app);
        
        // Create a consistent chat ID
        const chatId = [user.uid, activeContact.id].sort().join('_');
        const messagesQuery = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const fetchedMessages: ChatMessage[] = [];
            querySnapshot.forEach((doc) => {
                fetchedMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
            });
            setMessages(fetchedMessages);
            setLoadingMessages(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            toast({ variant: 'destructive', title: 'Failed to load messages.'});
            setLoadingMessages(false);
        });

        return () => unsubscribe();
    }, [user, activeContact, toast]);

    // Effect to scroll to bottom of chat
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !activeContact) return;

        setIsSending(true);
        const chatId = [user.uid, activeContact.id].sort().join('_');
        
        try {
            const result = await sendMessage({ chatId, senderId: user.uid, text: newMessage });
            if (result.type === 'success') {
                setNewMessage('');
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Failed to send message', description: error.message });
        } finally {
            setIsSending(false);
        }
    };
    
  return (
    <div className="animate-fade-in-up h-[calc(100vh-10rem)]">
      <PageHeader
        title="Secure Messaging"
        description="Communicate directly with your healthcare providers."
      />
      <div className="h-full">
        <GlowingCard className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
            {/* Contact List */}
            <div className="col-span-1 border-r border-border h-full flex flex-col">
              <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contacts..." className="pl-9" />
                  </div>
              </div>
              <ScrollArea className="flex-1">
                <nav className="p-2">
                  {loadingContacts ? (
                    <div className="space-y-2 p-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                  ) : contacts.length > 0 ? (
                    contacts.map(contact => (
                        <div key={contact.id} onClick={() => setActiveContact(contact)} className={cn(
                        "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary",
                        contact.id === activeContact?.id && "bg-secondary"
                        )}>
                        <Avatar>
                            <Image src={contact.avatar} width={40} height={40} data-ai-hint="person portrait" alt={contact.name} />
                            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold truncate">{contact.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                        </div>
                        </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground text-center">No contacts found.</p>
                  )}
                </nav>
              </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 lg:col-span-3 h-full flex flex-col">
              {activeContact ? (
                <>
                <div className="flex items-center gap-4 p-4 border-b border-border">
                    <Avatar>
                    <Image src={activeContact.avatar} width={40} height={40} data-ai-hint="doctor portrait" alt={activeContact.name}/>
                    <AvatarFallback>{activeContact.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{activeContact.name}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground capitalize">{activeContact.role}</p>
                    </div>
                    </div>
                </div>
                
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                    <div className="space-y-4">
                    {loadingMessages ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : messages.length > 0 ? (
                        messages.map(msg => (
                            <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
                            {msg.senderId !== user?.uid && (
                                <Avatar className="h-8 w-8">
                                <Image src={activeContact.avatar} width={32} height={32} data-ai-hint="doctor portrait" alt={activeContact.name}/>
                                <AvatarFallback>{activeContact.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs lg:max-w-md p-3 rounded-lg",
                                msg.senderId === user?.uid ? 'chat-bubble-sent' : 'chat-bubble-received'
                            )}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            </div>
                        ))
                    ) : (
                         <div className="flex justify-center items-center h-full"><p className="text-sm text-muted-foreground">Send a message to start the conversation.</p></div>
                    )}
                    </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-border mt-auto">
                    <form onSubmit={handleSendMessage} className="relative">
                    <Input placeholder="Type a message..." className="pr-12" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={isSending} />
                    <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isSending || !newMessage.trim()}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <SendHorizonal className="h-4 w-4" />}
                    </Button>
                    </form>
                </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p>Select a contact to start messaging.</p>
                </div>
              )}
            </div>
          </div>
        </GlowingCard>
      </div>
    </div>
  );
}
