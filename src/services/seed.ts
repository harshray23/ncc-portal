'use server';

import type { UserProfile } from '@/lib/types';

export async function seedDatabase() {
  try {
    // Dynamically import admin to catch initialization errors
    const admin = (await import('@/lib/firebase-admin')).default;
    const db = admin.firestore();
    const auth = admin.auth();

    const configRef = db.collection('system').doc('config');
    const configDoc = await configRef.get();

    if (configDoc.exists && configDoc.data()?.isSeeded) {
      return { success: false, message: 'Database has already been seeded.' };
    }

    // Create Admin User
    const adminEmail = 'elvishray007@gmail.com';
    const adminPassword = 'password-123456';
    let adminUserRecord;
    try {
        adminUserRecord = await auth.getUserByEmail(adminEmail);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            adminUserRecord = await auth.createUser({
                email: adminEmail,
                password: adminPassword,
                displayName: 'Elvish Ray',
            });
        } else {
            throw error;
        }
    }
    await auth.setCustomUserClaims(adminUserRecord.uid, { role: 'admin' });
    const adminProfile: Omit<UserProfile, 'regimentalNumber' | 'studentId' | 'rank' | 'unit'> = {
      uid: adminUserRecord.uid,
      email: adminEmail,
      name: 'Elvish Ray',
      role: 'admin',
    };
    await db.collection('users').doc(adminUserRecord.uid).set(adminProfile);


    // Create Cadet User
    const cadetEmail = 'homeharsh001@gmail.com';
    const cadetPassword = '147258369';
    let cadetUserRecord;
    try {
        cadetUserRecord = await auth.getUserByEmail(cadetEmail);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            cadetUserRecord = await auth.createUser({
                email: cadetEmail,
                password: cadetPassword,
                displayName: 'Harsh Home',
            });
        } else {
            throw error;
        }
    }
    await auth.setCustomUserClaims(cadetUserRecord.uid, { role: 'cadet' });
    const cadetProfile: UserProfile = {
      uid: cadetUserRecord.uid,
      email: cadetEmail,
      name: 'Harsh Home',
      role: 'cadet',
      regimentalNumber: 'PB20SDA000001',
      studentId: '20BCA001',
      rank: 'Cadet',
      unit: '10 Bengal Battalion',
    };
    await db.collection('users').doc(cadetUserRecord.uid).set(cadetProfile);

    // Set seeded flag
    await configRef.set({ isSeeded: true });

    return { success: true, message: 'Database seeded successfully!' };
  } catch (error: any)
   {
    console.error('Seeding error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: `An error occurred: ${message}` };
  }
}
