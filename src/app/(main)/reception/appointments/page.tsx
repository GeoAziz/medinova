import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReceptionAppointmentsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Appointment Management"
        description="Search, view, confirm, and reschedule patient appointments."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Full Appointment Schedule</CardTitle>
                <CardDescription>An interactive calendar or list view of all appointments.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient, doctor, or date..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Interactive calendar placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
