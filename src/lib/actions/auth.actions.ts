'use server';

import { getFirebaseAdmin } from '@/lib/firebase-admin';

// This action is callable from the client to resolve a regimental number to an email.
export async function getEmailForRegimentalNumber(regimentalNumber: string): Promise<{ email: string | null; error?: string }> {
  try {
    const admin = getFirebaseAdmin();
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('regimentalNumber', '==', regimentalNumber).limit(1).get();

    if (snapshot.empty) {
      return { email: null };
    }

    const userDoc = snapshot.docs[0];
    return { email: userDoc.data().email };
  } catch (error: any) {
    console.error("Error fetching email for regimental number:", error);
    return { email: null, error: error.message || 'An internal error occurred.' };
  }
}
