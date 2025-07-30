import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockChatContacts, mockChatMessages } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SendHorizonal, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPage() {
  const activeChatPartner = mockChatContacts[0];
  
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
                  {mockChatContacts.map(contact => (
                    <div key={contact.id} className={cn(
                      "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary",
                      contact.id === activeChatPartner.id && "bg-secondary"
                    )}>
                      <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                        <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && <Badge variant="destructive">{contact.unread}</Badge>}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 lg:col-span-3 h-full flex flex-col">
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <Avatar>
                  <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="doctor portrait"/>
                  <AvatarFallback>{activeChatPartner.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{activeChatPartner.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                        "h-2 w-2 rounded-full",
                        activeChatPartner.status === 'Online' ? 'bg-green-500' : 'bg-muted'
                    )} />
                    <p className="text-xs text-muted-foreground">{activeChatPartner.status}</p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockChatMessages.map(msg => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                      {msg.sender === 'other' && (
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://placehold.co/32x32.png`} data-ai-hint="doctor portrait" />
                           <AvatarFallback>{activeChatPartner.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn(
                          "max-w-xs lg:max-w-md p-3 rounded-lg",
                          msg.sender === 'me' ? 'chat-bubble-sent' : 'chat-bubble-received'
                      )}>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border mt-auto">
                <div className="relative">
                  <Input placeholder="Type a message..." className="pr-12" />
                  <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <SendHorizonal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </GlowingCard>
      </div>
    </div>
  );
}
