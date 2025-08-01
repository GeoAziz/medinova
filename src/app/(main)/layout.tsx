import { DashboardLayout } from '@/components/shared/dashboard-layout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
