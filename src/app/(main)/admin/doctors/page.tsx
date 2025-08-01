
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DoctorActions } from '@/components/admin/doctor-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export async function getDoctors(query: string) {
  try {
    // 1. Fetch all users with the 'doctor' role
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'doctor').get();
    if (usersSnapshot.empty) {
      return [];
    }
    
    let allUsers = usersSnapshot.docs.map(doc => ({ ...doc.data() } as User));

    // 2. Filter by search query if it exists
    if (query) {
      allUsers = allUsers.filter(user => 
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (allUsers.length === 0) {
      return [];
    }

    // 3. Get the corresponding doctor records for the filtered users
    const doctorIds = allUsers.map(user => user.uid);
    const doctorsSnapshot = await adminDb.collection('doctors').where(admin.firestore.FieldPath.documentId(), 'in', doctorIds).get();
    
    const doctorsData = doctorsSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    // 4. Combine user and doctor data
    const combinedData = allUsers.map(user => {
      const doctorRecord = doctorsData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        specialty: doctorRecord.specialty,
        department: doctorRecord.department,
        status: doctorRecord.status || 'Active',
        imageURL: user.profileImage || doctorRecord.imageURL,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
        bio: doctorRecord.bio,
        schedule: doctorRecord.schedule,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return combinedData;

  } catch (error) {
    console.error("Error fetching doctors:", error);
    return null;
  }
}

export type Doctor = Exclude<Awaited<ReturnType<typeof getDoctors>>, null>[0];


export default async function AdminDoctorsPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const doctors = await getDoctors(query);

  if (doctors === null) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch doctor data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Doctor Management"
        description="Manage doctor profiles, applications, and permissions."
        actions={<DoctorActions mode="add" />}
      />
      <div className="mx-auto w-full">
        <GlowingCard>
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Doctor Roster</CardTitle>
                    <CardDescription>A list of all doctors in the system.</CardDescription>
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
             {doctors.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No doctors found. Try adjusting your search.</p>
              </div>
            ) : (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map(doctor => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={doctor.imageURL} alt={doctor.name} data-ai-hint="doctor portrait" />
                          <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{doctor.name}</span>
                          <p className="text-xs text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={doctor.status === 'Active' ? 'default' : 'secondary'}
                        className={doctor.status === 'Active' ? 'bg-green-600/80' : ''}
                      >
                        {doctor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{doctor.createdAt}</TableCell>
                    <TableCell className="text-right">
                       <DoctorActions mode="edit" doctor={doctor} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
