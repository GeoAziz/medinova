import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function MROCompliancePage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Compliance Monitor"
        description="Track data privacy and regulatory compliance in real-time."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlowingCard>
            <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-5xl font-bold text-green-400">99.8%</div>
                <p className="text-xs text-muted-foreground">System-wide data handling compliance</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Potential Violations</CardTitle>
            </CardHeader>
            <CardContent>
                 <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>No active alerts</AlertTitle>
                    <AlertDescription>
                        The system has not detected any potential compliance violations in the last 72 hours.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
