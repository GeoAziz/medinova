'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Upload, FileText, User, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLabSummary, GenerateLabSummaryOutput } from '@/ai/flows/generate-lab-summary';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockLabTests } from '@/lib/data';

const currentTest = mockLabTests[0];

export default function LabWorkbenchPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawData, setRawData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<GenerateLabSummaryOutput | null>(null);

  const handleAnalyze = async () => {
    if (!rawData) {
      toast({ variant: 'destructive', title: 'Missing Data', description: 'Please input the raw lab data to analyze.' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await generateLabSummary({ rawData });
      setAnalysisResult(result);
      toast({ title: 'AI Analysis Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error during Analysis' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Workbench"
        description={`Processing Test ID: ${currentTest.id}`}
        actions={<Button>Submit Results</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Analysis & Results Entry</CardTitle>
              <CardDescription>Input raw data, generate AI summary, and upload final report.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rawData">Raw Lab Data</Label>
                    <Textarea id="rawData" placeholder="Paste or type raw output from analysis equipment..." className="h-48" value={rawData} onChange={e => setRawData(e.target.value)} />
                  </div>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate AI Summary
                  </Button>
                   <div className="space-y-2">
                    <Label htmlFor="reportFile">Upload Final Report (PDF)</Label>
                    <div className="flex items-center gap-2">
                        <Input id="reportFile" type="file" className="flex-1" />
                        <Button variant="secondary" size="icon"><Upload className="h-4 w-4"/></Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>AI Generated Summary</Label>
                  <ScrollArea className="h-80 rounded-md border p-4 bg-muted/50">
                    {analysisResult ? (
                      <div className="prose prose-sm dark:prose-invert">
                        <h4>Key Findings</h4>
                        <p>{analysisResult.keyFindings}</p>
                        <h4>Abnormalities Detected</h4>
                        <p>{analysisResult.abnormalities}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">AI analysis will appear here...</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </GlowingCard>
        </div>

        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Test Type</p>
                  <p className="font-semibold">{currentTest.testType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-semibold">{currentTest.patientName} ({currentTest.patientId})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Requesting Doctor</p>
                  <p className="font-semibold">{currentTest.requestingDoctor}</p>
                </div>
              </div>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
