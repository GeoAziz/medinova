
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, AlertTriangle, Edit, Trash2, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';

async function getReceptionists(query: string) {
  try {
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'receptionist').get();
    if (usersSnapshot.empty) return [];
    
    let allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

    if (query) {
      allUsers = allUsers.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (allUsers.length === 0) return [];

    const receptionistIds = allUsers.map(user => user.uid);
    const receptionistsSnapshot = await adminDb.collection('receptionists').where(admin.firestore.FieldPath.documentId(), 'in', receptionistIds).get();
    
    const receptionistsData = receptionistsSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    const combinedData = allUsers.map(user => {
      const receptionistRecord = receptionistsData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        appointmentsHandled: receptionistRecord.appointmentsHandled,
        incomingCalls: receptionistRecord.incomingCalls,
        imageURL: receptionistRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return combinedData;

  } catch (error) {
    console.error("Error fetching receptionists:", error);
    return null;
  }
}

export default async function AdminReceptionistsPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const receptionists = await getReceptionists(query);

  if (receptionists === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch receptionist data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Receptionist Management"
        description="Manage receptionist profiles and front-desk permissions."
        actions={<Button><UserPlus className="mr-2 h-4 w-4" /> Add Receptionist</Button>}
      />
      <GlowingCard>
        <CardHeader>
           <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Receptionist Roster</CardTitle>
                    <CardDescription>A list of all receptionists in the system.</CardDescription>
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
           {receptionists.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No receptionists found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receptionist</TableHead>
                  <TableHead>Appointments Handled</TableHead>
                  <TableHead>Incoming Calls</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receptionists.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.imageURL} alt={item.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.appointmentsHandled}</TableCell>
                    <TableCell>{item.incomingCalls}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                            <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
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
