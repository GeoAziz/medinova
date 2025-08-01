import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminAiInsightsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="AI Insight Center"
        description="Review AI-generated suggestions, anomalies, and reports."
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>AI Analysis Feed</CardTitle>
          <CardDescription>A feed of AI-driven insights will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">AI insights placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
