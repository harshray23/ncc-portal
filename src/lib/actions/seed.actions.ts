"use server";

import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

const usersToSeed = [
    {
        email: "admin@example.com",
        password: "password123",
        displayName: "Admin User",
        role: "admin",
        regimentalNumber: "ADMIN-001",
        studentId: "N/A",
        rank: "Colonel",
        phone: "N/A",
        whatsapp: "N/A",
        approved: true,
        unit: 'HQ',
        year: 0,
    },
    {
        email: "manager@example.com",
        password: "password123",
        displayName: "Manager User",
        role: "manager",
        regimentalNumber: "MANAGER-001",
        studentId: "N/A",
        rank: "Major",
        phone: "N/A",
        whatsapp: "N/A",
        approved: true,
        unit: 'HQ',
        year: 0,
    },
    {
        email: "cadet@example.com",
        password: "password123",
        displayName: "Cadet User",
        role: "cadet",
        regimentalNumber: "WB21SDA123456",
        studentId: "21BCS1001",
        rank: "Cadet",
        phone: "1234567890",
        whatsapp: "1234567890",
        approved: true,
        unit: '10 Bengal Battalion',
        year: 1,
    }
];

export async function seedDatabase() {
  try {
    const admin = getFirebaseAdmin();
    // Check if users already exist to avoid duplication
    const existingUsers = await Promise.all(
      usersToSeed.map(user => admin.auth().getUserByEmail(user.email).catch(() => null))
    );

    const usersThatExist = existingUsers.filter(u => u !== null);
    
    if (usersThatExist.length > 0) {
      return {
        type: "info",
        message: "Database has already been seeded. No new users were created.",
      };
    }

    const createdUsers = await Promise.all(
      usersToSeed.map(user => admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true, 
      }))
    );
    
    const firestore = admin.firestore();
    const batch = firestore.batch();

    createdUsers.forEach((userRecord, index) => {
        const userData = usersToSeed[index];
        const { password, ...profileData } = userData;
        const collectionName = `${userData.role}s`; // admins, cadets, managers
        const docRef = firestore.collection(collectionName).doc(userRecord.uid);
        
        batch.set(docRef, {
            ...profileData,
            uid: userRecord.uid,
            createdAt: new Date(),
            regimentalNumberEditCount: 0,
            profilePhotoUrl: `https://placehold.co/128x128.png?text=${userData.displayName.charAt(0)}`
        });
        
        // Also set custom claims on the user for role-based access control
        admin.auth().setCustomUserClaims(userRecord.uid, { role: userData.role });
    });

    await batch.commit();
    
    revalidatePath("/");
    return {
      type: "success",
      message: `${createdUsers.length} user(s) have been successfully seeded.`,
    };

  } catch (error: any) {
    console.error("Database Seeding Error:", error);
    return {
      type: "error",
      message: error.message || "An unexpected error occurred during seeding.",
    };
  }
}
