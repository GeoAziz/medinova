
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RecordsOfficerActions } from '@/components/admin/records-officer-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import Image from 'next/image';

async function getRecordsOfficers(query: string) {
  try {
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'medical_records_officer').get();
    if (usersSnapshot.empty) return [];
    
    let allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

    if (query) {
      allUsers = allUsers.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (allUsers.length === 0) return [];

    const officerIds = allUsers.map(user => user.uid);
    const officersSnapshot = await adminDb.collection('medicalRecordsOfficers').where(admin.firestore.FieldPath.documentId(), 'in', officerIds).get();
    
    const officersData = officersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    const combinedData = allUsers.map(user => {
      const officerRecord = officersData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        recordAccessLogs: officerRecord.recordAccessLogs,
        reportsGenerated: officerRecord.reportsGenerated,
        imageURL: officerRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    return combinedData;

  } catch (error) {
    console.error("Error fetching medical records officers:", error);
    return null;
  }
}

export type RecordsOfficer = Exclude<Awaited<ReturnType<typeof getRecordsOfficers>>, null>[0];


export default async function AdminRecordsOfficersPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const officers = await getRecordsOfficers(query);

  if (officers === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch MRO data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Medical Records Officer Management"
        description="Manage MRO profiles and data access permissions."
        actions={<RecordsOfficerActions mode="add" />}
      />
      <GlowingCard>
        <CardHeader>
           <div className="flex items-center justify-between">
                <div>
                  <CardTitle>MRO Roster</CardTitle>
                  <CardDescription>A list of all Medical Records Officers in the system.</CardDescription>
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
           {officers.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No Medical Records Officers found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Access Logs Reviewed</TableHead>
                  <TableHead>Reports Generated</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officers.map(item => (
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
                    <TableCell>{item.recordAccessLogs}</TableCell>
                    <TableCell>{item.reportsGenerated}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                        <RecordsOfficerActions mode="edit" officer={item} />
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
