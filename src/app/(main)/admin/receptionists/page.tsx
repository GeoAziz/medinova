
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ReceptionistActions } from '@/components/admin/receptionist-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

async function getReceptionists(query: string) {
  try {
    if (!adminDb) throw new Error("adminDb not initialized");
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'receptionist').get();
    if (usersSnapshot.empty) return [];
    let allUsers = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email ?? '',
        role: data.role ?? '',
        fullName: data.fullName ?? '',
        profileImage: data.profileImage ?? '',
        createdAt: data.createdAt,
      } as User;
    });

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
        deskAssignment: receptionistRecord.deskAssignment,
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

export type Receptionist = Exclude<Awaited<ReturnType<typeof getReceptionists>>, null>[0];


export default async function AdminReceptionistsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || '';
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
        actions={<ReceptionistActions mode="add" />}
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
                  <TableHead>Desk Assignment</TableHead>
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
                          <Image src={item.imageURL} width={40} height={40} alt={item.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.deskAssignment || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                       <ReceptionistActions mode="edit" receptionist={item} />
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
