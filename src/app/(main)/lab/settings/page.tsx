
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '@/lib/actions/settings.actions';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type LabSettings = {
    criticalAlerts: boolean;
    newSampleAlerts: boolean;
    soundEffects: boolean;
}

export default function LabSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<LabSettings>({
    criticalAlerts: true,
    newSampleAlerts: false,
    soundEffects: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const result = await getUserSettings();
      if (result) {
        setSettings({
            criticalAlerts: result.lab_criticalAlerts ?? true,
            newSampleAlerts: result.lab_newSampleAlerts ?? false,
            soundEffects: result.lab_soundEffects ?? true,
        });
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSettingChange = (key: keyof LabSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const result = await updateUserSettings({
        lab_criticalAlerts: settings.criticalAlerts,
        lab_newSampleAlerts: settings.newSampleAlerts,
        lab_soundEffects: settings.soundEffects,
    });

    if (result.type === 'success') {
        toast({ title: 'Settings Saved', description: 'Your preferences have been updated.' });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save settings.' });
    }
    setIsSaving(false);
  }

  if (loading) {
      return (
        <div className="animate-fade-in-up">
            <PageHeader
                title="Lab Settings"
                description="Manage your preferences and system configurations."
            />
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
      )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Settings"
        description="Manage your preferences and system configurations."
        actions={
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        }
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
                    <Switch id="critical-alerts" checked={settings.criticalAlerts} onCheckedChange={(val) => handleSettingChange('criticalAlerts', val)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                        <Label htmlFor="new-sample-alerts">New Sample Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when a new sample enters your queue.</p>
                    </div>
                    <Switch id="new-sample-alerts" checked={settings.newSampleAlerts} onCheckedChange={(val) => handleSettingChange('newSampleAlerts', val)} />
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
                    <Switch id="sound-effects" checked={settings.soundEffects} onCheckedChange={(val) => handleSettingChange('soundEffects', val)} />
                </div>
            </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
