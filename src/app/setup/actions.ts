'use server';

import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// The data to be seeded
const usersToSeed = [
    {
        uid: 'admin-user-01',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        profile: {
            name: 'Admin User',
            rank: 'Colonel',
            unit: 'NCC Directorate',
            approved: true,
        },
    },
    {
        uid: 'manager-user-01',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager',
        profile: {
            name: 'Manager User',
            rank: 'Major',
            unit: '10 Bengal Battalion',
            approved: true,
        },
    },
    {
        uid: 'cadet-user-01',
        email: 'cadet@example.com',
        password: 'password123',
        role: 'cadet',
        profile: {
            name: 'Cadet User',
            regimentalNumber: 'CADET001',
            studentId: 'STUDENT001',
            rank: 'Cadet',
            phone: '1234567890',
            whatsapp: '1234567890',
            approved: true,
            year: 1,
            unit: '10 Bengal Battalion',
            regimentalNumberEditCount: 0,
            profilePhotoUrl: 'https://placehold.co/128x128.png?text=C',
        },
    },
];

const campsToSeed = [
    {
        id: 'camp-atc-01',
        name: 'Annual Training Camp',
        description: 'The flagship annual training camp for all cadets. Mandatory for second years.',
        location: 'AEC College Ground',
        startDate: new Date(new Date().getFullYear(), 8, 15), // Sep 15
        endDate: new Date(new Date().getFullYear(), 8, 24), // Sep 24
        status: 'Upcoming',
    },
    {
        id: 'camp-tsc-01',
        name: 'Thal Sainik Camp (TSC)',
        description: 'A national level camp that gives an exposure to the cadets in military training and firing.',
        location: 'Delhi Cantt',
        startDate: new Date(new Date().getFullYear(), 10, 5), // Nov 5
        endDate: new Date(new Date().getFullYear(), 10, 16), // Nov 16
        status: 'Upcoming',
    },
];

export async function seedDatabaseAction(prevState: any, formData: FormData) {
  try {
    const admin = getFirebaseAdmin();
    const auth = admin.auth();
    const firestore = admin.firestore();
    const batch = firestore.batch();

    for (const userData of usersToSeed) {
        // Create user in Auth
        try {
            await auth.createUser({
                uid: userData.uid,
                email: userData.email,
                password: userData.password,
                displayName: userData.profile.name,
                emailVerified: true,
            });
        } catch (error: any) {
             if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
                console.log(`User ${userData.email} already exists in Auth. Skipping creation, but will update claims and profile.`);
            } else {
                throw error; // Re-throw other errors
            }
        }

        // Set custom claims
        await auth.setCustomUserClaims(userData.uid, { role: userData.role });
        
        // Add profile to Firestore
        const collectionName = `${userData.role}s`;
        const docRef = firestore.collection(collectionName).doc(userData.uid);
        
        const profileData = {
            ...userData.profile,
            uid: userData.uid,
            email: userData.email,
            role: userData.role,
            createdAt: new Date(),
        };

        batch.set(docRef, profileData, { merge: true }); // Use merge to avoid overwriting existing data if only updating
    }
    
    // Seed camps
    const campsRef = firestore.collection('camps');
    for (const camp of campsToSeed) {
        batch.set(campsRef.doc(camp.id), {
            ...camp,
            createdAt: new Date(),
        }, { merge: true });
    }

    await batch.commit();
    revalidatePath('/');
    console.log('Database seeded successfully!')
    return { success: true, message: 'Database seeded successfully with initial users and camps!' };
  } catch (error: any) {
    console.error('Database seeding failed:', error);
    return { success: false, message: error.message || 'An unknown error occurred during seeding.' };
  }
}
