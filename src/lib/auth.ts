import { getFirebaseAdmin } from './firebase-admin';
import { cookies } from 'next/headers';
import type { UserProfile } from './types';

export async function getCurrentUser(): Promise<UserProfile | null> {
    const sessionCookie = cookies().get('session')?.value || '';
    if (!sessionCookie) {
        return null;
    }

    try {
        const admin = getFirebaseAdmin();
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const role = decodedClaims.role as string;
        
        if (!role) return null;

        const collectionName = `${role}s`;
        const userDoc = await admin.firestore().collection(collectionName).doc(decodedClaims.uid).get();

        if (!userDoc.exists) {
            return null;
        }

        const data = userDoc.data()!;
        
        const userProfile: UserProfile = {
            uid: decodedClaims.uid,
            email: data.email,
            name: data.name,
            role: data.role,
            regimentalNumber: data.regimentalNumber,
            studentId: data.studentId,
            rank: data.rank,
            phone: data.phone,
            whatsapp: data.whatsapp,
            approved: data.approved,
            unit: data.unit,
            year: data.year,
            createdAt: data.createdAt.toDate().toISOString(),
            regimentalNumberEditCount: data.regimentalNumberEditCount || 0,
            profilePhotoUrl: data.profilePhotoUrl
        };
        
        return userProfile;

    } catch (error) {
        console.error("Failed to verify session cookie:", error);
        return null;
    }
}
