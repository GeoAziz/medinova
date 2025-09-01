
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Patient, NurseTask } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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
    
    // 3. Fetch all tasks for the patients in that ward
    let assignedTasks: NurseTask[] = [];
    const patientIds = assignedPatients.map(p => p.id);

    if (patientIds.length > 0) {
        // Firestore 'in' queries are limited to 30 items. If more patients, this would need batching.
        const tasksQuery = adminDb.collection('tasks').where('patientId', 'in', patientIds);
        const tasksSnapshot = await tasksQuery.get();
        assignedTasks = tasksSnapshot.docs.map(doc => {
            const data = doc.data();
            const patient = assignedPatients.find(p => p.id === data.patientId);
            return {
                id: doc.id,
                ...data,
                patientName: patient?.name || 'Unknown Patient',
                patientRoom: patient?.room || 'N/A',
            }
        }) as NurseTask[];
    }
    

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

export async function getDetailedPatientAssignments(nurseId: string, query?: string) {
    const { assignedPatients } = await getNurseDashboardData(nurseId);
    if (query) {
        const lowercasedQuery = query.toLowerCase();
        return assignedPatients.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.room.toLowerCase().includes(lowercasedQuery) ||
            p.condition?.toLowerCase().includes(lowercasedQuery)
        );
    }
    return assignedPatients;
}

export async function getAllAssignedTasks(nurseId: string, query?: string) {
    const { assignedTasks } = await getNurseDashboardData(nurseId);
     if (query) {
        const lowercasedQuery = query.toLowerCase();
        return assignedTasks.filter(t =>
            t.task.toLowerCase().includes(lowercasedQuery) ||
            t.patientName.toLowerCase().includes(lowercasedQuery) ||
            t.priority.toLowerCase().includes(lowercasedQuery)
        );
    }
    return assignedTasks;
}

export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
    try {
        await adminDb.collection('tasks').doc(taskId).update({
            isCompleted: isCompleted,
        });
        revalidatePath('/nurse/tasks');
        revalidatePath('/nurse/dashboard');
        return { type: 'success', message: 'Task status updated.' };
    } catch (error) {
        console.error('Error updating task:', error);
        return { type: 'error', message: 'Database Error: Failed to update task.' };
    }
}
