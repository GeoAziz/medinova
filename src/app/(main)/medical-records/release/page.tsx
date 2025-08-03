import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';

export default function MROReleasePage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Secure Data Release"
        description="Prepare and release authenticated medical records to authorized entities."
      />
      <div>
        <GlowingCard>
          <CardHeader>
            <CardTitle>Release Medical Records</CardTitle>
            <CardDescription>Fill out the form to generate a secure data package.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" placeholder="Enter patient ID to fetch records..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Information</Label>
              <Input id="recipient" placeholder="e.g., 'Dr. Smith, Mercy General Hospital' or 'court_order_#123'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Release Notes</Label>
              <Textarea id="notes" placeholder="Add any relevant authorization codes or notes for the release..." />
            </div>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="attachments" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Attach Supporting Documents</span></p>
                    </div>
                    <Input id="attachments" type="file" className="hidden" multiple />
                </label>
            </div>
            <div className="flex justify-end">
                <Button>Generate & Release Secure Package</Button>
            </div>
          </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
