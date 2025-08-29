
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Patient, NurseTask } from '@/lib/types';

export async function getNurseDashboardData(nurseId: string) {
  try {
    // 1. Fetch the nurse's profile to get their assigned ward
    const nurseDoc = await adminDb.collection('nurses').doc(nurseId).get();
    if (!nurseDoc.exists) {
      throw new Error('Nurse profile not found.');
    }
    const nurseData = nurseDoc.data();
    const assignedWard = nurseData?.ward;

    if (!assignedWard) {
      return { assignedPatients: [], assignedTasks: [], pendingTasksCount: 0, criticalAlertsCount: 0 };
    }

    // 2. Fetch all patients in the same ward
    const patientsQuery = adminDb.collection('patients').where('ward', '==', assignedWard);
    const patientsSnapshot = await patientsQuery.get();
    const assignedPatients = patientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];
    
    // 3. Fetch all tasks assigned to the nurse
    const tasksQuery = adminDb.collection('tasks').where('assignedNurseId', '==', nurseId);
    const tasksSnapshot = await tasksQuery.get();
    const assignedTasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as NurseTask[];

    // 4. Calculate stats
    const pendingTasksCount = assignedTasks.filter(t => !t.isCompleted).length;
    const criticalAlertsCount = assignedPatients.filter(p => p.condition === 'Critical').length;
    
    return {
      assignedPatients,
      assignedTasks: assignedTasks.sort((a,b) => a.isCompleted ? 1 : -1), // Show pending tasks first
      pendingTasksCount,
      criticalAlertsCount,
    };

  } catch (error) {
    console.error('Error fetching nurse dashboard data:', error);
    return {
      assignedPatients: [],
      assignedTasks: [],
      pendingTasksCount: 0,
      criticalAlertsCount: 0,
    };
  }
}
