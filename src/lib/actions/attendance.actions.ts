'use server';

import { getFirebaseAdmin } from '../firebase-admin';
import type { UserProfile, AttendanceData, AttendanceRecord } from '../types';

export async function getAttendanceData(date: Date): Promise<AttendanceData> {
    const admin = getFirebaseAdmin();
    const firestore = admin.firestore();

    const dateString = date.toISOString().split('T')[0];

    // Fetch all active cadets
    const cadetsSnapshot = await firestore.collection('cadets').where('approved', '==', true).get();
    const cadets = cadetsSnapshot.docs.map(doc => doc.data() as UserProfile);

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
        const admin = getFirebaseAdmin();
        const dateString = date.toISOString().split('T')[0];
        
        const dataToSave: Omit<AttendanceRecord, 'id'> = {
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
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getCadetAttendance(cadetId: string): Promise<Omit<AttendanceRecord, 'records'>[]> {
    try {
        const admin = getFirebaseAdmin();
        const snapshot = await admin.firestore().collection('attendance').get();

        const results: any[] = [];
        snapshot.forEach(doc => {
            const data = doc.data() as AttendanceRecord;
            const cadetRecord = data.records[cadetId];
            if (cadetRecord) {
                results.push({
                    id: doc.id,
                    eventName: `Attendance for ${doc.id}`, // Or some other event name logic
                    date: data.date.toDate(),
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
