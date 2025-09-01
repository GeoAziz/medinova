
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ClipboardList, ListFilter, Search } from 'lucide-react';
import type { NurseTask } from '@/lib/types';
import { toggleTaskCompletion } from '@/lib/actions/nurse-dashboard.actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

type NurseTasksPageProps = {
  tasks: NurseTask[];
  user: { uid: string; fullName: string; role: string; } | null;
};

// This is a client component to handle the interactions
function TaskManager({ tasks, user }: NurseTasksPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTaskToggle = async (taskId: string, currentStatus: boolean) => {
    const result = await toggleTaskCompletion(taskId, !currentStatus);
    if (result.type === 'error') {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    } else {
      toast({ title: 'Success', description: result.message });
    }
  };
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  if (!user || user.role !== 'nurse') {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Task Queue Manager"
        description="View, manage, and complete all tasks for your shift."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Full Task List</CardTitle>
                <CardDescription>
                    {tasks.length} tasks found.
                </CardDescription>
            </div>
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by task, patient, or priority..." 
                    className="pl-9" 
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
             <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No tasks found. Try adjusting your search.</p>
              </div>
          ) : (
            <div className="space-y-4">
                {tasks.map(task => (
                <div key={task.id} className={cn("flex items-center gap-4 p-3 rounded-lg border", task.isCompleted ? 'bg-secondary/50 opacity-70' : 'bg-secondary/20')}>
                    <Checkbox id={`task-${task.id}`} checked={task.isCompleted} onCheckedChange={() => handleTaskToggle(task.id, task.isCompleted)} />
                    <div className="flex-1">
                        <label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer">{task.task}</label>
                        <p className="text-xs text-muted-foreground">{task.patientName} - Room {task.patientRoom}</p>
                    </div>
                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'} className="ml-auto">
                        {task.priority}
                    </Badge>
                     <Button size="sm" variant="outline">Details</Button>
                </div>
                ))}
            </div>
          )}
        </CardContent>
      </GlowingCard>
    </div>
  );
}

// We still need a server component to fetch the initial data
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getAllAssignedTasks } from '@/lib/actions/nurse-dashboard.actions';

export default async function NurseTasksPageWrapper({ searchParams }: { searchParams?: { query?: string; } }) {
    const user = await getAuthenticatedUser();
    const query = searchParams?.query || '';
    
    // We fetch tasks on the server to ensure the initial page load is fast and SEO-friendly
    const tasks = user ? await getAllAssignedTasks(user.uid, query) : [];

    return <TaskManager tasks={tasks} user={user} />;
}
