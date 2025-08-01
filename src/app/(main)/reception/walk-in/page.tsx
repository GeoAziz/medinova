import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReceptionWalkInPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Walk-in Patient Registration"
        description="Register new or unscheduled patients arriving at the clinic."
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>New Patient Form</CardTitle>
          <CardDescription>A form for patient registration will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Patient registration form placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
