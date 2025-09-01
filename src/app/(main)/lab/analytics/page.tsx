
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState, useMemo } from 'react';
import { getLabDashboardData } from '@/lib/actions/lab-dashboard.actions';
import type { LabTest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function LabAnalyticsPage() {
  const [data, setData] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { allTests } = await getLabDashboardData();
      setData(allTests);
      setLoading(false);
    }
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!data.length) return { volume: [], types: [], turnaround: [] };

    // Group by test type
    const types = data.reduce((acc, test) => {
      acc[test.testType] = (acc[test.testType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeData = Object.entries(types).map(([name, value]) => ({ name, value }));

    // Group by date for volume
    const volume = data.reduce((acc, test) => {
        const date = new Date(test.receivedDate).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const volumeData = Object.entries(volume)
        .map(([date, count]) => ({ date, count }))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    // Mock turnaround data
    const turnaroundData = [
        { name: 'CBC', hours: 2.5 },
        { name: 'Lipid Panel', hours: 4 },
        { name: 'Thyroid Panel', hours: 6 },
        { name: 'Glucose Test', hours: 1.5 },
        { name: 'Biopsy', hours: 24 },
    ];

    return { volume: volumeData, types: typeData, turnaround: turnaroundData };
  }, [data]);
  
  const chartConfig = {
      count: { label: 'Tests' },
      hours: { label: 'Hours' },
      types: { label: 'Tests' },
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Analytics"
        description="Visualize test trends and operational data."
        actions={<Button variant="outline" disabled={loading}><Download className="mr-2 h-4 w-4" /> Export Report</Button>}
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="lg:col-span-3 h-64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowingCard className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Test Volume Trends</CardTitle>
                <CardDescription>Completed tests over the last month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData.volume} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            </GlowingCard>
            <GlowingCard>
            <CardHeader>
                <CardTitle>Tests by Type</CardTitle>
                <CardDescription>Distribution of all tests.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="h-64 w-full">
                    <PieChart>
                       <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                       <Pie data={chartData.types} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--chart-1))" >
                         {chartData.types.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                    </PieChart>
                 </ChartContainer>
            </CardContent>
            </GlowingCard>
            <GlowingCard className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Average Turnaround Time</CardTitle>
                <CardDescription>Average time from sample receipt to result (mock data).</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-48 w-full">
                    <BarChart data={chartData.turnaround} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <ChartTooltip content={<ChartTooltipContent />} />
                         <Bar dataKey="hours" fill="hsl(var(--chart-2))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            </GlowingCard>
        </div>
      )}
    </div>
  );
}
