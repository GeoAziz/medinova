import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function LabSettingsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Settings"
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
                        <Label htmlFor="critical-alerts">Critical Results Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive an immediate notification for critical value results.</p>
                    </div>
                    <Switch id="critical-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="new-sample-alerts">New Sample Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when a new sample enters your queue.</p>
                    </div>
                    <Switch id="new-sample-alerts" />
                </div>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage system sounds and theme preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="sound-effects">Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">Enable subtle UI sound effects for actions.</p>
                    </div>
                    <Switch id="sound-effects" defaultChecked/>
                </div>
            </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
