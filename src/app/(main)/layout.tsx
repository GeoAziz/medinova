import DashboardLayoutWrapper from '@/components/shared/dashboard-layout-wrapper';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
