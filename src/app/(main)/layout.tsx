import { DashboardLayout } from '@/components/shared/dashboard-layout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
=======
  // In a real app, user role would be determined from an auth session.
  // We'll pass it down to the layout to render the correct sidebar.
  // This could also be managed via a client-side context provider.
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
  return <DashboardLayout>{children}</DashboardLayout>;
}
