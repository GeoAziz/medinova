import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function MROSearchPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Patient Record Search"
        description="Securely search and retrieve patient medical records."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Record Search Portal</CardTitle>
                <CardDescription>Enter a query to begin searching the records database.</CardDescription>
            </div>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient name, ID, date of birth, or condition..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Search results will be displayed here.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
