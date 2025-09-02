
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RadiologistActions } from '@/components/admin/radiologist-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import Image from 'next/image';

async function getRadiologists(query: string) {
  try {
    if (!adminDb) throw new Error("adminDb not initialized");
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'radiologist').get();
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

    const radiologistIds = allUsers.map(user => user.uid);
    const radiologistsSnapshot = await adminDb.collection('radiologists').where(admin.firestore.FieldPath.documentId(), 'in', radiologistIds).get();
    
    const radiologistsData = radiologistsSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    const combinedData = allUsers.map(user => {
      const radiologistRecord = radiologistsData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        imagingTypes: radiologistRecord.imagingTypes,
        scanReports: radiologistRecord.scanReports,
        imageURL: user.profileImage || radiologistRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    return combinedData;
    
  } catch (error) {
    console.error("Error fetching radiologists:", error);
    return null;
  }
}

export type Radiologist = Exclude<Awaited<ReturnType<typeof getRadiologists>>, null>[0];


export default async function AdminRadiologistsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || '';
  const radiologists = await getRadiologists(query);

  if (radiologists === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch radiologist data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Radiologist Management"
        description="Manage radiologist profiles and system permissions."
        actions={<RadiologistActions mode="add" />}
      />
      <GlowingCard>
        <CardHeader>
           <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Radiologist Roster</CardTitle>
                  <CardDescription>A list of all radiologists in the system.</CardDescription>
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
           {radiologists.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No radiologists found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Radiologist</TableHead>
                  <TableHead>Primary Imaging Type</TableHead>
                  <TableHead>Reports This Month</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {radiologists.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <Image src={item.imageURL} width={40} height={40} alt={item.name} data-ai-hint="doctor portrait" />
                          <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.imagingTypes}</TableCell>
                    <TableCell>{item.scanReports}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right">
                       <RadiologistActions mode="edit" radiologist={item} />
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
