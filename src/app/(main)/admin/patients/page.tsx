
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Search } from 'lucide-react';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PatientActions } from '@/components/admin/patient-actions';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';
import { getDoctors } from '@/app/(main)/admin/doctors/page';


async function getPatients(query: string) {
  try {
    // 1. Fetch all users with the 'patient' role
    let usersSnapshot = await adminDb.collection('users').where('role', '==', 'patient').get();
    
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

    // 3. Get the corresponding patient records for the filtered users
    const patientIds = allUsers.map(user => user.uid);
    const patientsSnapshot = await adminDb.collection('patients').where(admin.firestore.FieldPath.documentId(), 'in', patientIds).get();
    
    const patientsData = patientsSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });

    // 4. Combine user and patient data
    const combinedData = allUsers.map(user => {
      const patientRecord = patientsData[user.uid] || {};
      return {
        id: user.uid,
        name: user.fullName,
        email: user.email,
        phone: patientRecord.phone,
        age: patientRecord.age,
        gender: patientRecord.gender,
        room: patientRecord.room,
        nationalId: patientRecord.nationalId,
        diagnosis: patientRecord.diagnosis,
        status: patientRecord.status,
        assignedDoctor: patientRecord.assignedDoctor,
        notes: patientRecord.notes,
        createdAt: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return combinedData;

  } catch (error) {
    console.error("Error fetching patients:", error);
    return null;
  }
}

export type Patient = Exclude<Awaited<ReturnType<typeof getPatients>>, null>[0];


export default async function AdminPatientsPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const query = searchParams?.query || '';
  const patients = await getPatients(query);
  const doctors = await getDoctors('');

  if (patients === null || doctors === null) {
     return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not fetch patient or doctor data from the database. Please check the server logs.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Patient Management"
        description="Oversee and manage all patient records in the system."
        actions={<PatientActions mode="add" doctors={doctors} />}
      />
      <div className="mx-auto w-full">
        <GlowingCard>
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Patient Database</CardTitle>
                  <CardDescription>A list of all patients currently in the system.</CardDescription>
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
            {patients.length === 0 ? (
                <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No patients found. Try adjusting your search.</p>
                </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Assigned Doctor</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map(patient => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">{patient.email}</div>
                      </TableCell>
                       <TableCell>{doctors.find(d => d.id === patient.assignedDoctor)?.name || 'N/A'}</TableCell>
                      <TableCell>{patient.room}</TableCell>
                      <TableCell>
                        <Badge 
                           variant={
                            patient.status === 'Discharged' ? 'outline' : 
                            patient.status === 'In-Patient' ? 'secondary' : 'default'}
                            className={patient.status === 'Critical' ? 'bg-destructive' : ''}
                        >
                            {patient.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.createdAt}</TableCell>
                      <TableCell className="text-right">
                          <PatientActions mode="edit" patient={patient} doctors={doctors} />
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
