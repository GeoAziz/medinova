import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { DashboardLayout } from './dashboard-layout';

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
