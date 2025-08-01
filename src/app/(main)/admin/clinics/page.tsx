import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

export default function AdminClinicsPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Clinic Management"
        description="Oversee all hospital branches and facilities."
        actions={<Button><Building className="mr-2 h-4 w-4" /> Add Clinic</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <CardTitle>Clinic Network Overview</CardTitle>
          <CardDescription>An interactive map or list of clinics will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">3D map visualization placeholder.</p>
          </div>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
