'use server';

import admin from '@/lib/firebase-admin';

// This action is callable from the client to resolve a regimental number to an email.
export async function getEmailForRegimentalNumber(regimentalNumber: string): Promise<{ email: string | null; error?: string }> {
  try {
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.where('regimentalNumber', '==', regimentalNumber).limit(1).get();

    if (snapshot.empty) {
      return { email: null };
    }

    const userDoc = snapshot.docs[0];
    return { email: userDoc.data().email };
  } catch (error) {
    console.error("Error fetching email for regimental number:", error);
    return { email: null, error: 'An internal error occurred.' };
  }
}
