import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function NurseAssignmentsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Patient Assignments"
        description="Detailed view of all patients currently under your care."
        actions={<Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter Patients</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>Patient Roster</CardTitle>
          <CardDescription>An interactive list or grid of assigned patients will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Patient data table placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
