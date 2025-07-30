import { DashboardLayout } from '@/components/shared/dashboard-layout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // In a real app, user role would be determined from an auth session.
  // We'll pass it down to the layout to render the correct sidebar.
  // This could also be managed via a client-side context provider.
  return <DashboardLayout>{children}</DashboardLayout>;
}
