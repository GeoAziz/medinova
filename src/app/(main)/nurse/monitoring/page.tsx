import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function NurseMonitoringPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Live Ward Monitoring"
        description="Real-time visualization of patient vitals and locations."
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>3D Hospital Floor Plan</CardTitle>
          <CardDescription>An interactive 3D model of the hospital wing will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-secondary/30">
            <Image src="https://placehold.co/800x400.png" alt="3D Floor Plan Placeholder" width={800} height={400} className="opacity-30" data-ai-hint="floor plan" />
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
