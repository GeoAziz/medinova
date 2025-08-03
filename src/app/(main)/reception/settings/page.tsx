import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function ReceptionSettingsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Reception Settings"
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
                        <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive an immediate notification for new emergency log entries.</p>
                    </div>
                    <Switch id="emergency-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="new-patient-alerts">New Patient Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when a new patient is registered.</p>
                    </div>
                    <Switch id="new-patient-alerts" />
                </div>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader>
                <CardTitle>AI Assistant (Z.A.L.I) Settings</CardTitle>
                <CardDescription>Manage your AI assistant preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="voice-assist">Voice Assistant</Label>
                        <p className="text-sm text-muted-foreground">Enable voice commands for Z.A.L.I.</p>
                    </div>
                    <Switch id="voice-assist" defaultChecked/>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="ai-suggestions">AI Suggestions</Label>
                        <p className="text-sm text-muted-foreground">Allow Z.A.L.I to provide real-time suggestions.</p>
                    </div>
                    <Switch id="ai-suggestions" defaultChecked/>
                </div>
            </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
