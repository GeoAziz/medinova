import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function LabAnalyticsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Analytics"
        description="Visualize test trends and operational data."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlowingCard className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Volume Trends</CardTitle>
            <CardDescription>Completed tests over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Line chart placeholder</p>
            </div>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader>
            <CardTitle>Test Turnaround Time</CardTitle>
            <CardDescription>Average time from sample receipt to result.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Bar chart placeholder</p>
            </div>
          </CardContent>
        </GlowingCard>
         <GlowingCard className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Abnormal Results Heatmap</CardTitle>
            <CardDescription>Peak times and types for flagged results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Heatmap placeholder</p>
            </div>
          </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
