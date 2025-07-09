'use server';

import { getFirebaseAdmin } from '../firebase-admin';
import type { UserProfile, AttendanceData, AttendanceRecord, CadetAttendanceRecord } from '../types';
import { getCurrentUser } from '../auth';
import { logActivity } from './activity.actions';
import { revalidatePath } from 'next/cache';

export async function getAttendanceData(date: Date): Promise<AttendanceData> {
    const admin = getFirebaseAdmin();
    const firestore = admin.firestore();

    const dateString = date.toISOString().split('T')[0];

    // Fetch all active cadets
    const cadetsSnapshot = await firestore.collection('cadets').where('approved', '==', true).get();
    const cadets = cadetsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            uid: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
        } as UserProfile;
    });

    // Fetch existing attendance for that day
    const attendanceDoc = await firestore.collection('attendance').doc(dateString).get();
    const existingRecords = attendanceDoc.exists ? (attendanceDoc.data() as AttendanceRecord).records : {};

    // Prepare records, ensuring every cadet has an entry
    const records: AttendanceData['records'] = {};
    for (const cadet of cadets) {
        records[cadet.uid] = existingRecords[cadet.uid] || {
            status: 'Present',
            remarks: '',
        };
    }

    return { cadets, records };
}

export async function saveAttendance(date: Date, records: AttendanceData['records']) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return { success: false, message: 'Permission denied.' };
        }

        const admin = getFirebaseAdmin();
        const dateString = date.toISOString().split('T')[0];
        
        const dataToSave: Omit<AttendanceRecord, 'id'|'date'> & { date: Date } = {
            date: date,
            records: {}
        };

        // Re-shape the data to match the AttendanceRecord type
        for (const cadetId in records) {
            dataToSave.records[cadetId] = {
                cadetId,
                status: records[cadetId].status,
                remarks: records[cadetId].remarks,
            };
        }
        
        await admin.firestore().collection('attendance').doc(dateString).set(dataToSave, { merge: true });

        await logActivity('Attendance Update', {
            userId: currentUser.uid,
            user: currentUser.name,
            role: currentUser.role,
            details: `Updated attendance for ${date.toISOString().split('T')[0]}.`
        });
        
        revalidatePath('/manager/activity');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getCadetAttendance(cadetId: string): Promise<CadetAttendanceRecord[]> {
    try {
        const admin = getFirebaseAdmin();
        const snapshot = await admin.firestore().collection('attendance').orderBy('date', 'desc').get();

        const results: CadetAttendanceRecord[] = [];
        snapshot.forEach(doc => {
            const data = doc.data() as any; // Firestore data
            const cadetRecord = data.records[cadetId];
            if (cadetRecord) {
                results.push({
                    id: doc.id,
                    eventName: `Attendance for ${doc.id}`, // Or some other event name logic
                    date: data.date.toDate().toISOString(),
                    status: cadetRecord.status,
                    remarks: cadetRecord.remarks,
                });
            }
        });
        return results;
    } catch (error) {
        console.error("Failed to get cadet attendance", error);
        return [];
    }
}
