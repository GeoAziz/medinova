
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { NurseActions } from '@/components/admin/nurse-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

async function getNurses(query: string) {
  try {
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'nurse').get();
    if (usersSnapshot.empty) return [];
    
    let allUsers = usersSnapshot.docs.map(doc => ({ ...doc.data() } as User));

    if (query) {
      allUsers = allUsers.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (allUsers.length === 0) return [];

    const nurseIds = allUsers.map(user => user.uid);
    const nursesSnapshot = await adminDb.collection('nurses').where(admin.firestore.FieldPath.documentId(), 'in', nurseIds).get();
    
    const nursesData = nursesSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    const combinedData = allUsers.map(user => {
      const nurseRecord = nursesData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        shift: nurseRecord.shift,
        ward: nurseRecord.ward,
        status: nurseRecord.status || 'Off Duty',
        imageURL: user.profileImage || nurseRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return combinedData;

  } catch (error) {
    console.error("Error fetching nurses:", error);
    return null;
  }
}

export type Nurse = Exclude<Awaited<ReturnType<typeof getNurses>>, null>[0];

export default async function AdminNursesPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const nurses = await getNurses(query);

  if (nurses === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch nurse data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Nurse Management"
        description="Manage nurse profiles, assignments, and schedules."
        actions={<NurseActions mode="add" />}
      />
      <GlowingCard>
        <CardHeader>
           <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Nurse Roster</CardTitle>
                  <CardDescription>A list of all nurses in the system.</CardDescription>
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
           {nurses.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No nurses found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nurse</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nurses.map(nurse => (
                  <TableRow key={nurse.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={nurse.imageURL} alt={nurse.name} data-ai-hint="nurse portrait" />
                          <AvatarFallback>{nurse.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{nurse.name}</span>
                          <p className="text-xs text-muted-foreground">{nurse.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{nurse.ward}</TableCell>
                    <TableCell>{nurse.shift}</TableCell>
                     <TableCell>
                        <Badge
                            variant={nurse.status === 'On Duty' ? 'default' : nurse.status === 'On Leave' ? 'secondary' : 'outline'}
                            className={nurse.status === 'On Duty' ? 'bg-green-600/80' : ''}
                        >
                            {nurse.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{nurse.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <NurseActions mode="edit" nurse={nurse} />
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
