import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReceptionCommsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Communication Hub"
        description="Communicate with doctors, nurses, and other staff in real-time."
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>Internal Messaging</CardTitle>
          <CardDescription>A secure chat interface will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Chat interface placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
