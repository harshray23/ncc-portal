'use server';

import { getFirebaseAdmin } from '@/lib/firebase-admin';

// This action is callable from the client to resolve a regimental number to an email.
export async function getEmailForRegimentalNumber(regimentalNumber: string): Promise<{ email: string | null; error?: string }> {
  try {
    const admin = getFirebaseAdmin();
    const snapshot = await admin.firestore().collection('cadets').where('regimentalNumber', '==', regimentalNumber).limit(1).get();

    if (snapshot.empty) {
      return { email: null, error: 'No cadet found with that regimental number.' };
    }
    
    const cadet = snapshot.docs[0].data();
    return { email: cadet.email };

  } catch (error: any) {
    console.error("Error fetching email for regimental number:", error);
    return { email: null, error: error.message || 'An internal error occurred.' };
  }
}
