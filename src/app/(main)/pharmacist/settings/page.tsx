import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PharmacistSettingsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Pharmacy Settings"
        description="Manage your preferences and system configurations."
      />
      <div className="space-y-6">
        <GlowingCard>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="interaction-alerts">Drug Interaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive an immediate notification for potential drug interactions.</p>
                    </div>
                    <Switch id="interaction-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="stock-alerts">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when medication stock falls below the threshold.</p>
                    </div>
                    <Switch id="stock-alerts" defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="new-rx-alerts">New Prescription Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get a notification when a new prescription enters your queue.</p>
                    </div>
                    <Switch id="new-rx-alerts" />
                </div>
            </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
