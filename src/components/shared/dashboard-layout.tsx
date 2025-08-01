
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  Bell,
  Shield,
  Stethoscope,
  MessageSquare,
  CalendarDays,
  Microscope,
  FlaskConical,
  Users,
  Building,
  LineChart,
  BrainCircuit,
  Settings,
  User,
  Beaker,
  FileScan,
  HeartPulse,
  ClipboardList,
  UserCheck,
  LayoutGrid,
  ClipboardCheck,
  Warehouse,
  Pill,
  UserPlus,
  AlertTriangle,
  FileText,
  ScanSearch,
  Upload,
  History,
  Archive,
  TestTube,
  FileSearch as FileSearchIcon,
  ShieldCheck,
  UploadCloud,
  ScrollText,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const patientNav: NavItem[] = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: Home },
  { href: '/patient/visualization', label: 'HoloMed Hub', icon: Microscope },
  { href: '/patient/book-appointment', label: 'Book Appointment', icon: CalendarDays },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
];

const doctorNav: NavItem[] = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: Stethoscope },
  { href: '/doctor/diagnostics', label: 'Diagnostics', icon: FlaskConical },
  { href: '/chat', label: 'Messages', icon: MessageSquare },
];

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Shield },
  { href: '/admin/patients', label: 'Patients', icon: Users },
  { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/admin/nurses', label: 'Nurses', icon: HeartPulse },
  { href: '/admin/pharmacists', label: 'Pharmacists', icon: Pill },
  { href: '/admin/lab-scientists', label: 'Lab Scientists', icon: Beaker },
  { href: '/admin/radiologists', label: 'Radiologists', icon: FileScan },
  { href: '/admin/receptionists', label: 'Receptionists', icon: UserPlus },
  { href: '/admin/records-officers', label: 'Records Officers', icon: FileText },
  { href: '/admin/clinics', label: 'Clinics', icon: Building, disabled: true },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart, disabled: true },
  { href: '/admin/ai-insights', label: 'AI Insights', icon: BrainCircuit, disabled: true },
];

const labNav: NavItem[] = [
    { href: '/lab/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/lab/workbench', label: 'Workbench', icon: FileScan },
    { href: '/lab/analytics', label: 'Analytics', icon: LineChart },
    { href: '/lab/history', label: 'History', icon: Archive },
    { href: '/lab/settings', label: 'Settings', icon: Settings },
];

const nurseNav: NavItem[] = [
    { href: '/nurse/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/nurse/assignments', label: 'Assignments', icon: UserCheck },
    { href: '/nurse/monitoring', label: 'Live Monitoring', icon: HeartPulse },
    { href: '/nurse/tasks', label: 'Tasks', icon: ClipboardList },
];

const pharmacistNav: NavItem[] = [
    { href: '/pharmacist/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/pharmacist/prescriptions', label: 'Prescriptions', icon: ClipboardCheck },
    { href: '/pharmacist/inventory', label: 'Inventory', icon: Warehouse },
    { href: '/pharmacist/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/pharmacist/history', label: 'History', icon: History },
    { href: '/pharmacist/settings', label: 'Settings', icon: Settings },
];

const receptionistNav: NavItem[] = [
    { href: '/reception/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/reception/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/reception/walk-in', label: 'Walk-ins', icon: UserPlus },
    { href: '/reception/emergency', label: 'Emergency Log', icon: AlertTriangle },
    { href: '/reception/comms', label: 'Comms', icon: MessageSquare },
    { href: '/reception/reports', label: 'Reports', icon: FileText },
    { href: '/reception/settings', label: 'Settings', icon: Settings },
];

const radiologistNav: NavItem[] = [
    { href: '/radiologist/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/radiologist/review', label: 'Scan Review', icon: ScanSearch },
    { href: '/radiologist/upload', label: 'Upload', icon: Upload },
    { href: '/radiologist/history', label: 'History', icon: Archive },
];

const medicalRecordsOfficerNav: NavItem[] = [
    { href: '/medical-records/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/medical-records/search', label: 'Record Search', icon: FileSearchIcon },
    { href: '/medical-records/requests', label: 'Access Requests', icon: UserCheck },
    { href: '/medical-records/release', label: 'Data Release', icon: UploadCloud },
    { href: '/medical-records/compliance', label: 'Compliance', icon: ShieldCheck },
    { href: '/medical-records/audit', label: 'Audit Logs', icon: ScrollText },
];


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  let navItems: NavItem[] = [];
  let userRole: 'Patient' | 'Doctor' | 'Admin' | 'Lab Scientist' | 'Nurse' | 'Pharmacist' | 'Receptionist' | 'Radiologist' | 'Medical Records Officer' = 'Patient';
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
  } else if (pathname.startsWith('/lab')) {
    navItems = labNav;
    userRole = 'Lab Scientist';
    userName = 'Lab Scientist 04';
    userInitial = 'LS';
  } else if (pathname.startsWith('/nurse')) {
    navItems = nurseNav;
    userRole = 'Nurse';
    userName = 'Nurse Kai';
    userInitial = 'NK';
  } else if (pathname.startsWith('/pharmacist')) {
    navItems = pharmacistNav;
    userRole = 'Pharmacist';
    userName = 'Riya Singh';
    userInitial = 'RS';
  } else if (pathname.startsWith('/reception')) {
    navItems = receptionistNav;
    userRole = 'Receptionist';
    userName = 'Javier "Jay" Rios';
    userInitial = 'JR';
  } else if (pathname.startsWith('/radiologist')) {
    navItems = radiologistNav;
    userRole = 'Radiologist';
    userName = 'Dr. Chloe Benali';
    userInitial = 'CB';
  } else if (pathname.startsWith('/medical-records')) {
    navItems = medicalRecordsOfficerNav;
    userRole = 'Medical Records Officer';
    userName = 'Officer Z-X9';
    userInitial = 'ZX';
  } else {
    navItems = patientNav;
    userRole = 'Patient';
    userName = 'Alex Ryder';
    userInitial = 'AR';
  }

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
    router.push('/auth');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-32" />
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label} disabled={item.disabled}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
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
                            You have 1 new message.
                          </p>
                        </div>
                        <div className="text-sm">
                           <p>Your appointment with Dr. Reed is confirmed.</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://placehold.co/40x40.png`} alt={userName} data-ai-hint="profile" />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col text-right md:flex">
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
