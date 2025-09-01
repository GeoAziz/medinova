import { getFirestore } from 'firebase-admin/firestore';

export interface AuditLog {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public async log(event: Omit<AuditLog, 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...event,
      timestamp: new Date(),
    };

    try {
      await this.db.collection('audit_logs').add(auditLog);
      
      // If this is a sensitive operation, also store in a separate collection
      if (this.isSensitiveOperation(event.action)) {
        await this.db.collection('sensitive_audit_logs').add(auditLog);
      }
    } catch (error) {
      console.error('Failed to write audit log:', error);
      // Implement backup logging mechanism
      this.fallbackLog(auditLog);
    }
  }

  private isSensitiveOperation(action: string): boolean {
    const sensitiveActions = [
      'VIEW_MEDICAL_RECORD',
      'UPDATE_MEDICAL_RECORD',
      'ACCESS_PHI',
      'EXPORT_DATA',
      'DELETE_RECORD',
      'CHANGE_PERMISSIONS',
    ];
    return sensitiveActions.includes(action);
  }

  private fallbackLog(auditLog: AuditLog): void {
    // Implement local filesystem logging as backup
    console.error('AUDIT_LOG_FALLBACK:', JSON.stringify(auditLog));
  }

  public async queryAuditLogs(
    filters: Partial<AuditLog>,
    startDate?: Date,
    endDate?: Date
  ): Promise<AuditLog[]> {
    let query: FirebaseFirestore.Query = this.db.collection('audit_logs');

    if (filters.userId) {
      query = query.where('userId', '==', filters.userId);
    }

    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }

    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as AuditLog);
  }
}
