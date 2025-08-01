import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ReceptionReportsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Daily Reports"
        description="Generate and export daily logs for patient check-ins and activities."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Today's Log</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>Check-in & Activity Log</CardTitle>
          <CardDescription>A filterable table of today's activities will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Reports table placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
