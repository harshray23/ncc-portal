'use server';

import { getFirebaseAdmin } from '../firebase-admin';
import type { AppNotification, Camp } from '../types';

export async function getDashboardStats() {
    try {
        const admin = getFirebaseAdmin();
        const firestore = admin.firestore();

        const cadetsSnap = await firestore.collection('cadets').get();
        const campsSnap = await firestore.collection('camps').where('status', '==', 'Upcoming').get();
        const regsSnap = await firestore.collection('registrations').where('status', '==', 'Pending').get();

        const stats = [
            { id: 'totalCadets', title: "Total Cadets", value: cadetsSnap.size.toString(), color: "text-blue-500" },
            { id: 'activeCamps', title: "Active Camps", value: campsSnap.size.toString(), color: "text-orange-500" },
            { id: 'pendingRegistrations', title: "Pending Registrations", value: regsSnap.size.toString(), color: "text-green-500" },
        ];

        // For now, recent activities will be hardcoded as we don't have an audit log collection yet
        const recentActivities = [
            { description: "Database re-seeded with initial data.", timestamp: new Date().toISOString() },
            { description: "System migrated to live Firestore database.", timestamp: new Date(Date.now() - 3600000).toISOString() },
        ];

        return { stats, recentActivities };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            stats: [
                { id: 'totalCadets', title: "Total Cadets", value: "0", color: "text-blue-500" },
                { id: 'activeCamps', title: "Active Camps", value: "0", color: "text-orange-500" },
                { id: 'pendingRegistrations', title: "Pending Registrations", value: "0", color: "text-green-500" },
            ],
            recentActivities: [],
        };
    }
}

export async function getCadetDashboardData(cadetId: string): Promise<{ notifications: AppNotification[], nextCamp: Camp | null }> {
    try {
        const admin = getFirebaseAdmin();
        const firestore = admin.firestore();

        const notifsSnap = await firestore.collection('notifications').where('userId', '==', cadetId).orderBy('timestamp', 'desc').limit(5).get();
        const notifications = notifsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp.toDate().toISOString(),
            } as AppNotification
        });

        const nextCampSnap = await firestore.collection('camps').where('status', '==', 'Upcoming').orderBy('startDate', 'asc').limit(1).get();
        if (nextCampSnap.empty) {
            return { notifications, nextCamp: null };
        }

        const campData = nextCampSnap.docs[0].data();
        const nextCamp = {
            id: nextCampSnap.docs[0].id,
            ...campData,
            startDate: campData.startDate.toDate().toISOString(),
            endDate: campData.endDate.toDate().toISOString(),
        } as Camp;

        return { notifications, nextCamp };

    } catch (error) {
        console.error("Error fetching cadet dashboard data:", error);
        return { notifications: [], nextCamp: null };
    }
}
