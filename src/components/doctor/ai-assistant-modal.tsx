'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { summarizeMedicalHistory } from '@/ai/flows/summarize-medical-history';
import { suggestTreatmentOptions } from '@/ai/flows/suggest-treatment-options';

export function AiAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [history, setHistory] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    if (!history) return;
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await summarizeMedicalHistory({ medicalHistory: history });
      setSummary(result.summary);
      toast({ title: 'Summary Generated' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Summarizing' });
    } finally {
      setIsSummarizing(false);
    }
  };

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState({ treatmentSuggestions: '', rationale: '', additionalTests: '' });
  
  const handleSuggest = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      setIsSuggesting(true);
      setSuggestionResult({ treatmentSuggestions: '', rationale: '', additionalTests: '' });

      try {
        const result = await suggestTreatmentOptions({
            medicalHistory: data.medicalHistory as string,
            currentSymptoms: data.currentSymptoms as string,
            patientAge: Number(data.patientAge),
            patientWeight: Number(data.patientWeight),
            knownAllergies: data.knownAllergies as string,
        });
        setSuggestionResult(result);
        toast({ title: 'Suggestions Generated' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error Generating Suggestions' });
      } finally {
        setIsSuggesting(false);
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><Sparkles className="mr-2 h-4 w-4" /> AI Tools</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Medical Assistant</DialogTitle>
          <DialogDescription>
            Access powerful AI tools to aid in your diagnostic process.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="summarize">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summarize">Summarize History</TabsTrigger>
            <TabsTrigger value="suggest">Suggest Treatments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summarize" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Textarea id="history" placeholder="Paste patient's medical history here..." className="h-64" value={history} onChange={e => setHistory(e.target.value)} />
                <Button onClick={handleSummarize} disabled={isSummarizing || !history}>
                  {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Summarize
                </Button>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="summary">AI Summary</Label>
                 <ScrollArea className="h-64 rounded-md border p-4 bg-muted/50">
                    <p className="text-sm whitespace-pre-wrap">{summary || 'Summary will appear here...'}</p>
                 </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="suggest" className="py-4">
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSuggest}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="medicalHistory">Medical History</Label>
                        <Textarea id="medicalHistory" name="medicalHistory" placeholder="Patient's past conditions, surgeries..." required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="currentSymptoms">Current Symptoms</Label>
                        <Textarea id="currentSymptoms" name="currentSymptoms" placeholder="Describe current symptoms..." required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="patientAge">Age</Label>
                            <Input id="patientAge" name="patientAge" type="number" placeholder="e.g., 45" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="patientWeight">Weight (kg)</Label>
                            <Input id="patientWeight" name="patientWeight" type="number" placeholder="e.g., 70" required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="knownAllergies">Known Allergies</Label>
                        <Input id="knownAllergies" name="knownAllergies" placeholder="e.g., Penicillin, Peanuts" defaultValue="None" required />
                    </div>
                     <Button type="submit" disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Get Suggestions
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label>AI Suggestions</Label>
                     <ScrollArea className="h-[25.5rem] rounded-md border p-4 bg-muted/50">
                        {suggestionResult.treatmentSuggestions ? (
                            <div className="prose prose-sm dark:prose-invert">
                                <h4>Treatment Suggestions</h4>
                                <p>{suggestionResult.treatmentSuggestions}</p>
                                <h4>Rationale</h4>
                                <p>{suggestionResult.rationale}</p>
                                <h4>Additional Tests</h4>
                                <p>{suggestionResult.additionalTests}</p>
                            </div>
                        ) : 'Suggestions will appear here...'}
                     </ScrollArea>
                </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
