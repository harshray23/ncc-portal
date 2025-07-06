'use server';

import { getFirebaseAdmin } from '@/lib/firebase-admin';

// This action is callable from the client to resolve a regimental number to an email.
export async function getEmailForRegimentalNumber(regimentalNumber: string): Promise<{ email: string | null; error?: string }> {
  try {
    const admin = getFirebaseAdmin();
    const usersRef = admin.firestore().collection('users');
    const snapshot = await usersRef.get(); // Fetch all users

    if (snapshot.empty) {
      return { email: null };
    }
    
    let foundEmail: string | null = null;
    // Manually filter through the documents
    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.regimentalNumber === regimentalNumber) {
            foundEmail = data.email;
            break; // Stop searching once found
        }
    }

    if (foundEmail) {
        return { email: foundEmail };
    } else {
        // If not found after checking all documents
        return { email: null };
    }

  } catch (error: any) {
    console.error("Error fetching email for regimental number:", error);
    return { email: null, error: error.message || 'An internal error occurred.' };
  }
}
