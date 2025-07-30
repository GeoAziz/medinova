'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import {
  Home,
  Calendar,
  FileText,
  Stethoscope,
  Users,
  MessageSquare,
  Shield,
  AreaChart,
  GitBranch,
  Settings,
  LogOut,
  Bell,
  Bot,
  User,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const patientNav: NavItem[] = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: Home },
  { href: '/patient/book-appointment', label: 'Book Appointment', icon: Calendar },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
];

const doctorNav: NavItem[] = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: Home },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
];

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Shield },
];

const bottomNav = [
  { href: '#', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  let navItems: NavItem[] = [];
  let userRole: 'Patient' | 'Doctor' | 'Admin' = 'Patient';
  let userName = 'Alex Ryder';
  let userInitial = 'AR';
  
  if (pathname.startsWith('/doctor')) {
    navItems = doctorNav;
    userRole = 'Doctor';
    userName = 'Dr. Evelyn Reed';
    userInitial = 'ER';
  } else if (pathname.startsWith('/admin')) {
    navItems = adminNav;
    userRole = 'Admin';
    userName = 'SysAdmin';
    userInitial = 'SA';
  } else {
    navItems = patientNav;
    userRole = 'Patient';
    userName = 'Alex Ryder';
    userInitial = 'AR';
  }

  const isActive = (href: string) => pathname === href;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-24" />
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                       {item.label === 'Messages' && (
                        <Badge variant="destructive" className="ml-auto group-data-[collapsible=icon]:hidden">1</Badge>
                       )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
              {bottomNav.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.href}>
                      <SidebarMenuButton tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                 <Link href="/auth">
                  <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-xl font-semibold">{userRole} Portal</h1>
                </div>
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative rounded-full">
                        <Bell />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent animate-ping" />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            You have 2 new messages.
                          </p>
                        </div>
                        <div className="text-sm">
                           <p>Your appointment with Dr. Reed is confirmed.</p>
                           <p className="mt-2">New message from Dr. Tanaka.</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://placehold.co/40x40.png`} alt={userName} data-ai-hint="profile" />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col md:flex">
                        <span className="text-sm font-medium">{userName}</span>
                        <span className="text-xs text-muted-foreground">{userRole}</span>
                    </div>
                  </div>
                </div>
            </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
