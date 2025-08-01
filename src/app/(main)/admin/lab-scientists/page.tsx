
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LabScientistActions } from '@/components/admin/lab-scientist-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';

async function getLabScientists(query: string) {
  try {
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'lab_scientist').get();
    if (usersSnapshot.empty) return [];
    
    let allUsers = usersSnapshot.docs.map(doc => ({ ...doc.data() } as User));

    if (query) {
      allUsers = allUsers.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (allUsers.length === 0) return [];

    const scientistIds = allUsers.map(user => user.uid);
    const scientistsSnapshot = await adminDb.collection('labScientists').where(admin.firestore.FieldPath.documentId(), 'in', scientistIds).get();
    
    const scientistsData = scientistsSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    const combinedData = allUsers.map(user => {
      const scientistRecord = scientistsData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        labType: scientistRecord.labType,
        recentTests: scientistRecord.recentTests,
        imageURL: user.profileImage || scientistRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return combinedData;

  } catch (error) {
    console.error("Error fetching lab scientists:", error);
    return null;
  }
}

export type LabScientist = Exclude<Awaited<ReturnType<typeof getLabScientists>>, null>[0];


export default async function AdminLabScientistsPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const scientists = await getLabScientists(query);

  if (scientists === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch lab scientist data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Lab Scientist Management"
        description="Manage lab scientist profiles and permissions."
        actions={<LabScientistActions mode="add" />}
      />
      <GlowingCard>
        <CardHeader>
           <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lab Scientist Roster</CardTitle>
                  <CardDescription>A list of all lab scientists in the system.</CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                    <form>
                        <Input placeholder="Search by name or email..." className="pl-9" name="query" defaultValue={query}/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </form>
                </div>
            </div>
        </CardHeader>
        <CardContent>
           {scientists.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No lab scientists found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scientist</TableHead>
                  <TableHead>Lab Type</TableHead>
                  <TableHead>Tests This Month</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scientists.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.imageURL} alt={item.name} data-ai-hint="scientist portrait" />
                          <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.labType}</TableCell>
                    <TableCell>{item.recentTests}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                        <LabScientistActions mode="edit" scientist={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           )}
        </CardContent>
      </GlowingCard>
    </div>
  );
}
