
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { FileText, Heart, Thermometer, Activity, Bot } from 'lucide-react';
import HologramClientWrapper from '@/components-client/HologramClientWrapper';

const mockReports = [
  { id: 'mri-01', title: 'Brain MRI', date: '2024-07-15', image: 'https://picsum.photos/400/250', hint: 'brain scan' },
  { id: 'lab-01', title: 'Blood Work', date: '2024-07-12', image: 'https://picsum.photos/400/250', hint: 'lab results' },
  { id: 'xray-01', title: 'Chest X-Ray', date: '2024-06-28', image: 'https://picsum.photos/400/250', hint: 'x-ray' },
  { id: 'ecg-01', title: 'ECG Analysis', date: '2024-05-20', image: 'https://picsum.photos/400/250', hint: 'heart ecg' },
];

export default function VisualizationPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Zizo_HoloMed_Hub"
        description="Your interactive health visualization center."
        actions={<Button variant="outline"><Bot className="mr-2 h-4 w-4" /> Ask Zizo_Bot</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 3D Viewer Section */}
        <div className="lg:col-span-2">
          <GlowingCard>
            <CardHeader>
              <CardTitle>3D Holographic Viewer</CardTitle>
              <CardDescription>Interact with your anatomical data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center p-4">
                <HologramClientWrapper />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline">Skin</Button>
                <Button variant="outline">Muscle</Button>
                <Button variant="outline">Skeleton</Button>
                <Button variant="outline">Organs</Button>
              </div>
            </CardContent>
          </GlowingCard>
        </div>

        {/* Vitals and Meds */}
        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Live Vitals</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Heart className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-lg font-bold">72 bpm</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Activity className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="text-lg font-bold">120/80</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Thermometer className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-lg font-bold">36.8°C</p>
                </div>
              </div>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>MedBox</CardTitle>
              <CardDescription>Upcoming Doses</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Nebivolol</p>
                        <p className="text-sm text-muted-foreground">Next dose: 8:00 PM</p>
                    </div>
                    <Badge>Due in 2h</Badge>
                </div>
            </CardContent>
          </GlowingCard>
        </div>
      </div>

       {/* Reports Carousel */}
       <div className="mt-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Report Timeline</CardTitle>
              <CardDescription>Review your recent scans and lab results.</CardDescription>
            </CardHeader>
            <CardContent>
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                    {mockReports.map(report => (
                        <CarouselItem key={report.id} className="md:basis-1/2 lg:basis-1/3">
                            <Card>
                                <CardContent className="p-0">
                                    <Image src={report.image} width={400} height={250} data-ai-hint={report.hint} alt={report.title} className="rounded-t-lg aspect-video object-cover" />
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
    </PageContainer>
  );
}

import { PageContainer } from '@/components/shared/page-container';
