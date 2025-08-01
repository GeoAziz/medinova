import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PharmacistAlertsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Drug Alerts & Interactions"
        description="Review system-generated safety alerts."
        actions={<Button variant="outline">Acknowledge All</Button>}
      />
      <div className="max-w-4xl space-y-6">
        <GlowingCard>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>Alerts requiring immediate attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High-Risk Interaction Detected</AlertTitle>
              <AlertDescription>
                Patient PID-008 (Leo Carter) prescribed Amoxicillin, which may interact with their existing Warfarin prescription. Please review immediately.
              </AlertDescription>
            </Alert>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Notifications regarding stock levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Low Stock Warning</AlertTitle>
              <AlertDescription>
                Stock for Levothyroxine 50mcg is below the threshold of 100 units. Current stock: 80 units.
              </AlertDescription>
            </Alert>
             <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Out of Stock</AlertTitle>
              <AlertDescription>
                Amoxicillin 500mg is currently out of stock. A new order has been placed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
