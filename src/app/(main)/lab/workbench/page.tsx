'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Upload, FileText, User, Stethoscope, Image as ImageIcon, Microscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLabSummary, GenerateLabSummaryOutput } from '@/ai/flows/generate-lab-summary';
import { analyzeLabImage, AnalyzeLabImageOutput } from '@/ai/flows/analyze-lab-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLabTests } from '@/lib/data';
import Image from 'next/image';

const currentTest = mockLabTests[0];

export default function LabWorkbenchPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawData, setRawData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<GenerateLabSummaryOutput | null>(null);
  
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<AnalyzeLabImageOutput | null>(null);


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
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            setImagePreview(dataUri);
            handleImageAnalysis(dataUri);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleImageAnalysis = async (dataUri: string) => {
    setIsAnalyzingImage(true);
    setImageAnalysisResult(null);
    try {
        const result = await analyzeLabImage({ photoDataUri: dataUri });
        setImageAnalysisResult(result);
        toast({ title: "AI Image Analysis Complete" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error Analyzing Image' });
    } finally {
        setIsAnalyzingImage(false);
    }
  }


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
              <CardDescription>Input data or upload an image for AI-powered analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="data">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="data"><FileText className="mr-2" /> Raw Data Analysis</TabsTrigger>
                        <TabsTrigger value="image"><ImageIcon className="mr-2" /> Image Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="data" className="mt-4">
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
                    </TabsContent>
                    
                    <TabsContent value="image" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imageFile">Upload Image for Analysis</Label>
                                     <div className="flex items-center justify-center w-full">
                                        <label htmlFor="imageFile" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Microscope className="w-8 h-8 mb-4 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                                            </div>
                                            <Input id="imageFile" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div> 
                                </div>
                                {imagePreview && (
                                    <div className="aspect-video relative rounded-md overflow-hidden border">
                                        <Image src={imagePreview} alt="Uploaded sample" layout="fill" objectFit="contain" />
                                    </div>
                                )}
                           </div>
                           <div className="space-y-2">
                                <Label>AI Image Analysis Report</Label>
                                <ScrollArea className="h-80 rounded-md border p-4 bg-muted/50">
                                    {isAnalyzingImage ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                        </div>
                                    ) : imageAnalysisResult ? (
                                    <div className="prose prose-sm dark:prose-invert">
                                        <h4>Analysis</h4>
                                        <p>{imageAnalysisResult.analysis}</p>
                                        <h4>Key Observations</h4>
                                        <ul>
                                            {imageAnalysisResult.keyObservations.map((obs, i) => <li key={i}>{obs}</li>)}
                                        </ul>
                                    </div>
                                    ) : (
                                    <p className="text-sm text-muted-foreground">Upload an image to begin analysis...</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
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
