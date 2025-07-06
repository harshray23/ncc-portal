'use server';

import { z } from 'zod';
import { getFirebaseAdmin } from '../firebase-admin';
import type { Camp, CampRegistration, UserProfile } from '../types';
import { revalidatePath } from 'next/cache';

const campSchema = z.object({
  name: z.string().min(1, 'Camp name is required.'),
  location: z.string().min(1, 'Location is required.'),
  description: z.string().min(1, 'Description is required.'),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

function docToCamp(doc: FirebaseFirestore.DocumentSnapshot): Camp {
    const data = doc.data()!;
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        location: data.location,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        status: data.status,
    };
}

export async function createCamp(prevState: any, formData: FormData) {
    const validatedFields = campSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            type: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid data provided.'
        };
    }

    try {
        const admin = getFirebaseAdmin();
        await admin.firestore().collection('camps').add({
            ...validatedFields.data,
            status: 'Upcoming',
            createdAt: new Date(),
        });
        revalidatePath('/admin/manage-camps');
        return { type: 'success' };
    } catch (error: any) {
        return { type: 'error', message: error.message };
    }
}

export async function getCamps(): Promise<Camp[]> {
    try {
        const admin = getFirebaseAdmin();
        const snapshot = await admin.firestore().collection('camps').orderBy('startDate', 'desc').get();
        return snapshot.docs.map(docToCamp);
    } catch (error) {
        console.error("Failed to get camps:", error);
        return [];
    }
}

export async function getCampDetails(campId: string) {
    try {
        const admin = getFirebaseAdmin();
        const campDoc = await admin.firestore().collection('camps').doc(campId).get();
        if (!campDoc.exists) return null;

        const registrationsSnapshot = await admin.firestore().collection('registrations').where('campId', '==', campId).get();
        const registrations = registrationsSnapshot.docs.map(doc => {
            const data = doc.data()!;
            return {
                id: doc.id,
                ...data,
                registeredAt: data.registeredAt.toDate(),
            } as CampRegistration;
        });

        return {
            camp: docToCamp(campDoc),
            registrations,
        };
    } catch (error) {
        console.error("Failed to get camp details:", error);
        return null;
    }
}

export async function updateRegistrationStatus(registrationId: string, status: 'Accepted' | 'Rejected', campId: string): Promise<{success: boolean, message?: string}> {
    try {
        const admin = getFirebaseAdmin();
        const regRef = admin.firestore().collection('registrations').doc(registrationId);
        
        await admin.firestore().runTransaction(async (transaction) => {
            const regDoc = await transaction.get(regRef);
            if (!regDoc.exists) {
                throw new Error("Registration not found.");
            }
            transaction.update(regRef, { status });

            const regData = regDoc.data() as CampRegistration;
            const campDoc = await transaction.get(admin.firestore().collection('camps').doc(campId));
            const campName = campDoc.data()?.name || "a camp";

            const message = status === 'Accepted'
                ? `Congratulations! You have been selected for the ${campName}.`
                : `We regret to inform you that your registration for ${campName} was not accepted.`;

            const notifRef = admin.firestore().collection('notifications').doc();
            transaction.set(notifRef, {
                userId: regData.cadetId,
                message,
                read: false,
                timestamp: new Date(),
                href: '/cadet/camps'
            });
        });
        
        revalidatePath(`/admin/manage-camps/${campId}`);
        revalidatePath('/cadet/dashboard'); // For the user's notifications
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update registration:", error);
        return { success: false, message: error.message };
    }
}

export async function deleteCamp(campId: string): Promise<{success: boolean, message?: string}> {
     try {
        const admin = getFirebaseAdmin();
        await admin.firestore().collection('camps').doc(campId).delete();
        // Also delete associated registrations
        const regSnapshot = await admin.firestore().collection('registrations').where('campId', '==', campId).get();
        const batch = admin.firestore().batch();
        regSnapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        revalidatePath('/admin/manage-camps');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete camp:", error);
        return { success: false, message: error.message };
    }
}


export async function getCampsForCadet(cadetId: string) {
    try {
        const admin = getFirebaseAdmin();
        const campsSnapshot = await admin.firestore().collection('camps').where('status', '==', 'Upcoming').get();
        const registrationsSnapshot = await admin.firestore().collection('registrations').where('cadetId', '==', cadetId).get();

        const camps = campsSnapshot.docs.map(docToCamp);
        const registrations = registrationsSnapshot.docs.map(doc => {
             const data = doc.data()!;
            return {
                id: doc.id,
                ...data,
                registeredAt: data.registeredAt.toDate(),
            } as CampRegistration;
        });
        
        return { camps, registrations };
    } catch (error) {
        console.error("Failed to get camps for cadet:", error);
        return { camps: [], registrations: [] };
    }
}

export async function registerForCamp(campId: string, user: UserProfile) {
     try {
        const admin = getFirebaseAdmin();
        const registrationData: Omit<CampRegistration, 'id' | 'registeredAt'> = {
            campId,
            cadetId: user.uid,
            cadetName: user.name,
            cadetYear: user.year,
            cadetRegimentalNumber: user.regimentalNumber,
            status: 'Pending',
        };
        await admin.firestore().collection('registrations').add({
            ...registrationData,
            registeredAt: new Date(),
        });
        revalidatePath('/cadet/camps');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
