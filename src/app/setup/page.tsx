import { SeedButton } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader>
          <CardTitle>Database Initial Setup</CardTitle>
          <CardDescription>
            Click the button below to seed your Firestore database with initial users and data.
            This is a one-time operation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription>
              Ensure you have set up your Firebase credentials in the <code>.env.local</code> file before proceeding. The app will not work without them.
            </AlertDescription>
          </Alert>
          <form action={seedDatabaseAction}>
            <SeedButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// We need to define the server action here or in a separate file.
// For simplicity, let's keep it here but ideally it would be in actions.ts

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
        email: 'cadet1@example.com',
        password: 'password123',
        role: 'cadet',
        profile: {
            name: 'Priya Verma',
            regimentalNumber: 'PB20SDA123457',
            studentId: '20BCS1025',
            rank: 'Cadet',
            phone: '1234567890',
            whatsapp: '1234567890',
            approved: true,
            year: 2,
            unit: '10 Bengal Battalion',
            regimentalNumberEditCount: 0,
            profilePhotoUrl: 'https://placehold.co/128x128.png?text=P',
        },
    },
];

async function seedDatabaseAction() {
  'use server';
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
                console.log(`User ${userData.email} already exists in Auth. Skipping creation.`);
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

        batch.set(docRef, profileData);
    }
    
    await batch.commit();
    revalidatePath('/');
    console.log('Database seeded successfully!')
    return { success: true, message: 'Database seeded successfully with initial users!' };
  } catch (error: any) {
    console.error('Database seeding failed:', error);
    return { success: false, message: error.message || 'An unknown error occurred during seeding.' };
  }
}
