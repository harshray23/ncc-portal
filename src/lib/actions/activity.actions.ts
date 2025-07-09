'use server';

import { getFirebaseAdmin } from '../firebase-admin';
import type { AuditLog, AuditLogType, UserRole } from '../types';

export async function getAuditLogs(): Promise<AuditLog[]> {
    try {
        const admin = getFirebaseAdmin();
        const firestore = admin.firestore();

        const snapshot = await firestore.collection('auditLog').orderBy('timestamp', 'desc').limit(50).get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp.toDate().toISOString(),
            } as AuditLog;
        });

    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }
}

export async function logActivity(
    type: AuditLogType,
    data: { userId: string, user: string, role: UserRole, details: string }
) {
    try {
        const admin = getFirebaseAdmin();
        await admin.firestore().collection('auditLog').add({
            ...data,
            type,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error(`Failed to log activity of type ${type}:`, error);
        // Do not throw, logging is a non-critical background task
    }
}

export async function logLoginAction(data: { userId: string, user: string, role: UserRole }) {
    await logActivity('Login', { ...data, details: `Successful login to ${data.role} portal.` });
}
