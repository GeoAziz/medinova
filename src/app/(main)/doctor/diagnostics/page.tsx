// src/app/(main)/doctor/diagnostics/page.tsx
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BrainCircuit, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { diagnoseCondition } from '@/ai/flows/diagnose-condition';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const mockRadiologyReports = [
  { id: 'xray-01', title: 'Chest X-Ray', date: '2024-06-28', image: 'https://placehold.co/600x400.png', hint: 'x-ray' },
  { id: 'mri-01', title: 'Brain MRI', date: '2024-07-15', image: 'https://placehold.co/600x400.png', hint: 'brain scan' },
  { id: 'ct-01', title: 'Abdominal CT', date: '2024-07-20', image: 'https://placehold.co/600x400.png', hint: 'ct scan' },
];

export default function DoctorDiagnosticsPage() {
  const { toast } = useToast();
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState({
    potentialDiagnosis: '',
    rationale: '',
    nextSteps: '',
  });

  const handleDiagnose = async () => {
    if (!symptoms || !history) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide both symptoms and medical history.' });
      return;
    }
    setIsDiagnosing(true);
    setDiagnosisResult({ potentialDiagnosis: '', rationale: '', nextSteps: '' });
    try {
      const result = await diagnoseCondition({ symptoms, medicalHistory: history });
      setDiagnosisResult(result);
      toast({ title: 'AI Diagnosis Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error during Diagnosis' });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Diagnostic Center"
        description="Utilize AI and advanced tools to analyze patient data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI-Powered Diagnostics</CardTitle>
              <CardDescription>Enter patient details to generate a potential diagnosis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea id="symptoms" placeholder="e.g., persistent cough, fever, fatigue..." className="h-32" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="history">Relevant Medical History</Label>
                    <Textarea id="history" placeholder="e.g., history of asthma, non-smoker..." className="h-32" value={history} onChange={e => setHistory(e.target.value)} />
                  </div>
                  <Button onClick={handleDiagnose} disabled={isDiagnosing}>
                    {isDiagnosing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Analyze & Diagnose
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>AI Analysis & Report</Label>
                  <ScrollArea className="h-80 rounded-md border p-4 bg-muted/50">
                    {diagnosisResult.potentialDiagnosis ? (
                        <div className="prose prose-sm dark:prose-invert">
                            <h4>Potential Diagnosis</h4>
                            <p>{diagnosisResult.potentialDiagnosis}</p>
                            <h4>Rationale</h4>
                            <p>{diagnosisResult.rationale}</p>
                            <h4>Recommended Next Steps</h4>
                            <p>{diagnosisResult.nextSteps}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Diagnosis report will appear here...</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>Radiology Image Viewer</CardTitle>
              <CardDescription>Review recent patient scans.</CardDescription>
            </CardHeader>
            <CardContent>
               <Carousel opts={{ align: "start", loop: false }}>
                    <CarouselContent>
                    {mockRadiologyReports.map(report => (
                        <CarouselItem key={report.id} className="md:basis-1/2 lg:basis-1/3">
                            <Card>
                                <CardContent className="p-0">
                                    <Image src={report.image} data-ai-hint={report.hint} alt={report.title} width={400} height={250} className="rounded-t-lg aspect-video object-cover" />
                                    <div className="p-4">
                                        <p className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> {report.title}</p>
                                        <p className="text-sm text-muted-foreground">{report.date}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12" />
                </Carousel>
            </CardContent>
          </GlowingCard>

        </div>
        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>3D Anatomical Viewer</CardTitle>
              <CardDescription>Interactive patient model.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center p-4">
                 <Image src="https://placehold.co/400x400.png" alt="3D Body Model Placeholder" width={400} height={400} className="object-cover rounded-md" data-ai-hint="human anatomy" />
              </div>
               <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled>Skin</Button>
                <Button variant="outline" size="sm" disabled>Muscle</Button>
                <Button variant="outline" size="sm" disabled>Skeleton</Button>
                <Button variant="outline" size="sm" disabled>Organs</Button>
              </div>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
