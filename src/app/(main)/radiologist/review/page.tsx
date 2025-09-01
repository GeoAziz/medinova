import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockScanRequests } from '@/lib/data';
import Image from 'next/image';
import { ZoomIn, RotateCw, Edit, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RadiologistReviewPage() {
  const currentScan = mockScanRequests[0];

  return (
    <PageContainer>
      <PageHeader
        title="Scan Review Room"
        description="Analyze imaging results and compile your report."
        actions={<Button><Send className="mr-2 h-4 w-4" /> Submit Report</Button>}
      />
      <GridContainer cols={{ default: 1, lg: 3 }}>
        <div className="lg:col-span-2">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Interactive Viewer</CardTitle>
              <CardDescription>Patient: {currentScan.patientName} ({currentScan.patientId}) - {currentScan.scanType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center p-2 border border-secondary">
                 <Image src={currentScan.imageUrl} data-ai-hint="ct scan" alt={currentScan.scanType} width={800} height={450} className="object-contain rounded-md" />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="icon" disabled><ZoomIn /></Button>
                <Button variant="outline" size="icon" disabled><RotateCw /></Button>
                <Button variant="outline" size="icon" disabled><Edit /></Button>
              </div>
            </CardContent>
          </GlowingCard>
        </div>

        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Radiology Report</CardTitle>
              <CardDescription>Compile your findings and diagnosis here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className='space-y-2'>
                    <Label htmlFor="findings">Key Findings</Label>
                    <Textarea id="findings" placeholder="Describe the key observations from the scan..." className="h-32" />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="impression">Impression / Diagnosis</Label>
                    <Textarea id="impression" placeholder="Provide your professional impression or diagnosis..." className="h-32" />
                </div>
              </div>
            </CardContent>
          </GlowingCard>
        </div>
      </GridContainer>
       <div className="mt-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Incoming Scan Queue</CardTitle>
              <CardDescription>Select a scan to begin your review.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                    {mockScanRequests.map(scan => (
                        <Card key={scan.id} className="min-w-64 cursor-pointer hover:border-primary">
                            <CardContent className="p-0">
                                <Image src={scan.imageUrl} data-ai-hint={scan.scanType === 'X-Ray' ? 'x-ray' : scan.scanType === 'MRI' ? 'mri scan' : 'ct scan'} alt={scan.scanType} width={256} height={144} className="rounded-t-lg aspect-video object-cover" />
                                <div className="p-3">
                                    <p className="font-semibold truncate">{scan.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{scan.scanType}</p>
                                     <Badge 
                                        variant={scan.status === 'Reviewed' ? 'default' : scan.status === 'Pending' ? 'secondary' : 'destructive'}
                                        className={`mt-2 ${scan.status === 'Reviewed' ? 'bg-green-600/80' : ''}`}
                                    >
                                        {scan.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>
            </CardContent>
          </GlowingCard>
       </div>
    </PageContainer>
  );
}

import { PageContainer } from '@/components/shared/page-container';
import { GridContainer } from '@/components/shared/grid-container';
