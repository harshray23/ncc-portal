'use server';

import admin from '@/lib/firebase-admin';
import type { UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

function convertDocToProfile(doc: admin.firestore.DocumentSnapshot): UserProfile {
    const data = doc.data();
    if (!data) throw new Error('Document data is empty.');
    
    // Convert Firestore Timestamps to Date objects
    const profile: UserProfile = {
        uid: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        regimentalNumber: data.regimentalNumber,
        regimentalNumberEditCount: data.regimentalNumberEditCount,
        studentId: data.studentId,
        rank: data.rank,
        phone: data.phone,
        whatsapp: data.whatsapp,
        approved: data.approved,
        createdAt: data.createdAt.toDate(),
        year: data.year,
        profilePhotoUrl: data.profilePhotoUrl
    };
    return profile;
}

export async function getCadets(): Promise<UserProfile[]> {
  try {
    const usersSnapshot = await admin.firestore().collection('users').where('role', '==', 'cadet').get();
    return usersSnapshot.docs.map(convertDocToProfile);
  } catch (error) {
    console.error("Failed to fetch cadets:", error);
    return [];
  }
}

export async function updateCadet(cadetData: UserProfile): Promise<{ success: boolean; message?: string }> {
  try {
    const { uid, ...dataToUpdate } = cadetData;
    
    const userRef = admin.firestore().collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        return { success: false, message: 'Cadet not found.' };
    }
    const originalData = doc.data() as UserProfile;

    let finalData = { ...dataToUpdate };

    // Handle regimental number edit count
    if (finalData.regimentalNumber !== originalData.regimentalNumber) {
        const editCount = originalData.regimentalNumberEditCount ?? 0;
        if (editCount < 2) {
            finalData.regimentalNumberEditCount = editCount + 1;
        } else {
            // Revert if somehow edited on the client
            finalData.regimentalNumber = originalData.regimentalNumber; 
        }
    }
    
    await userRef.update(finalData);
    
    // Also update email in Firebase Auth if it changed
    if (finalData.email !== originalData.email) {
        await admin.auth().updateUser(uid, { email: finalData.email });
    }

    revalidatePath('/admin/manage-cadets');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update cadet:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteCadet(uid: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Delete from Firestore
    await admin.firestore().collection('users').doc(uid).delete();
    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    revalidatePath('/admin/manage-cadets');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete cadet:", error);
    return { success: false, message: error.message };
  }
}

export async function updateCadetYears(uids: string[], year: number): Promise<{ success: boolean; message?: string }> {
    try {
        const batch = admin.firestore().batch();
        const usersRef = admin.firestore().collection('users');
        uids.forEach(uid => {
            batch.update(usersRef.doc(uid), { year: year });
        });
        await batch.commit();
        
        revalidatePath('/admin/manage-year');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update cadet years:", error);
        return { success: false, message: error.message };
    }
}
