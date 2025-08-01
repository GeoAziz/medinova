'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { month: 'January', users: 186 },
  { month: 'February', users: 305 },
  { month: 'March', users: 237 },
  { month: 'April', users: 73 },
  { month: 'May', users: 209 },
  { month: 'June', users: 214 },
];

const chartConfig = { users: { label: "New Users", color: "hsl(var(--primary))" }};

export function AnalyticsChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: -10 }}>
                <defs><linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/></linearGradient></defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#fillUsers)" />
            </AreaChart>
        </ChartContainer>
    )
}
