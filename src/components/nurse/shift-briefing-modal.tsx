'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { generateShiftBriefing } from '@/ai/flows/generate-shift-briefing';

export function ShiftBriefingModal({ nurseName }: { nurseName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [briefing, setBriefing] = useState('');

  const handleGenerate = async () => {
    if (!notes) {
      toast({ variant: 'destructive', title: 'Notes are empty', description: 'Please provide your shift notes to generate a briefing.' });
      return;
    }
    setIsGenerating(true);
    setBriefing('');
    try {
      const result = await generateShiftBriefing({ notes, nurseName });
      setBriefing(result.briefing);
      toast({ title: 'AI Briefing Generated' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Generating Briefing' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleModalClose = (open: boolean) => {
    if (!open) {
        setNotes('');
        setBriefing('');
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button><Send className="mr-2 h-4 w-4" /> Prepare Shift Handover</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Shift Handover</DialogTitle>
          <DialogDescription>
            Enter your raw shift notes and Zizo will generate a structured handover report for the next nurse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Your Shift Notes</Label>
              <Textarea id="notes" placeholder="e.g., 'Checked on Ryder in 301-A, vitals stable. Carter in 302-A had a spike in HR around 3am...'" className="h-80" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating || !notes}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Handover Briefing
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Generated Briefing</Label>
            <ScrollArea className="h-[23rem] rounded-md border p-4 bg-muted/50">
              {briefing ? (
                 <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: briefing.replace(/\n/g, '<br />') }} />
              ) : (
                <p className="text-sm text-muted-foreground">The structured handover report will appear here...</p>
              )}
            </ScrollArea>
          </div>
        </div>
         <DialogFooter>
          <Button variant="outline" onClick={() => handleModalClose(false)}>Close</Button>
          <Button>Send to Next Shift</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
