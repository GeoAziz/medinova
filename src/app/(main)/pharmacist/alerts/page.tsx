'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Bot, Loader2, Sparkles, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { checkDrugInteractions, CheckDrugInteractionsOutput } from '@/ai/flows/check-drug-interactions';

export default function PharmacistAlertsPage() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [currentMeds, setCurrentMeds] = useState('Warfarin, Lisinopril');
  const [newMed, setNewMed] = useState('Amoxicillin');
  const [interactionResult, setInteractionResult] = useState<CheckDrugInteractionsOutput | null>(null);

  const handleCheckInteractions = async () => {
    if (!currentMeds || !newMed) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide both current and new medications.' });
      return;
    }
    setIsChecking(true);
    setInteractionResult(null);
    try {
      const result = await checkDrugInteractions({ currentMedications: currentMeds, newMedication: newMed });
      setInteractionResult(result);
      toast({ title: 'Interaction Check Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error during Interaction Check' });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Drug Alerts & Interactions"
        description="Review system-generated safety alerts and run AI-powered checks."
      />
      
      <GlowingCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> AI Drug Interaction Checker</CardTitle>
          <CardDescription>Enter medications to check for potential adverse interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentMeds">Patient's Current Medications</Label>
                <Textarea id="currentMeds" placeholder="e.g., Warfarin, Lisinopril" value={currentMeds} onChange={e => setCurrentMeds(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMed">New Medication</Label>
                <Input id="newMed" placeholder="e.g., Amoxicillin" value={newMed} onChange={e => setNewMed(e.target.value)} />
              </div>
              <Button onClick={handleCheckInteractions} disabled={isChecking}>
                {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Check for Interactions
              </Button>
            </div>
            <div className="md:col-span-2">
                <Label>AI Analysis Report</Label>
                <div className="h-40 rounded-md border p-4 bg-muted/50">
                    {interactionResult ? (
                        <Alert variant={interactionResult.hasInteraction ? "destructive" : "default"}>
                            {interactionResult.hasInteraction ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                            <AlertTitle>{interactionResult.hasInteraction ? "Potential Interaction Detected" : "No Significant Interactions Found"}</AlertTitle>
                            <AlertDescription>
                                {interactionResult.interactionSummary}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <p className="text-sm text-muted-foreground">Interaction report will appear here...</p>
                    )}
                </div>
            </div>
          </div>
        </CardContent>
      </GlowingCard>

      <GlowingCard>
        <CardHeader>
          <CardTitle>System Inventory Alerts</CardTitle>
          <CardDescription>Automated notifications regarding stock levels.</CardDescription>
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
  );
}
