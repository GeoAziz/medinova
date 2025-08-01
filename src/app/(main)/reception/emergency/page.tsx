import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReceptionEmergencyPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Emergency Log"
        description="Track and manage emergency patient arrivals and triage."
      />
      <GlowingCard>
        <CardHeader className="text-red-400">
          <CardTitle>Live Emergency Queue</CardTitle>
          <CardDescription className="text-red-400/80">Real-time feed of critical patient check-ins.</CardDescription>
        </Header>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-red-500/50 rounded-lg">
            <p className="text-red-400/70">Emergency triage list placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
