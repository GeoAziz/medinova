
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPharmacistDashboardData } from '@/lib/actions/pharmacist-dashboard.actions';
import { PharmacistPrescription } from '@/lib/types';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { PrescriptionActions } from '@/components/pharmacist/prescription-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PharmacistPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const query = searchParams.get('query') || '';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { allPrescriptions } = await getPharmacistDashboardData(query);
      setPrescriptions(allPrescriptions);
      setLoading(false);
    }
    fetchData();
  }, [query]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Prescription Queue"
        description="Search, view, and manage all incoming prescriptions."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>
                {loading ? 'Loading prescriptions...' : `${prescriptions.length} total prescriptions found.`}
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by patient, drug, or doctor..." 
                className="pl-9" 
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={query}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : prescriptions.length > 0 ? (
                  prescriptions.map(rx => (
                    <TableRow key={rx.id}>
                      <TableCell>
                        <div className="font-medium">{rx.patientName}</div>
                        <div className="text-xs text-muted-foreground">{rx.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{rx.medication}</div>
                        <div className="text-xs text-muted-foreground">{rx.dosage}</div>
                      </TableCell>
                      <TableCell>{rx.requestingDoctor}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            rx.status === 'Pending' ? 'destructive' :
                            rx.status === 'Ready for Pickup' ? 'secondary' :
                            rx.status === 'Fulfilled' ? 'default' : 'outline'
                          }
                          className={rx.status === 'Fulfilled' ? 'bg-green-600/80' : ''}
                        >
                          {rx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PrescriptionActions prescriptionId={rx.id} status={rx.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No prescriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
