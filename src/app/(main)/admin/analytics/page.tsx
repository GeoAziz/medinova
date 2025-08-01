import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Platform Analytics"
        description="Real-time data and reports on system performance and usage."
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>System Performance Dashboard</CardTitle>
          <CardDescription>Live charts and metrics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Analytics charts placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
