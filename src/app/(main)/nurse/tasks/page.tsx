import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';

export default function NurseTasksPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Task Queue Manager"
        description="View, manage, and complete all tasks for your shift."
        actions={<Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter Tasks</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>Full Task List</CardTitle>
          <CardDescription>A comprehensive and interactive list of your tasks will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Task management board placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
