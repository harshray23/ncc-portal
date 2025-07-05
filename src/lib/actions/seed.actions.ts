"use server";

import admin from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

const usersToSeed = [
    {
        email: "elvishray007@gmail.com",
        password: "password123",
        displayName: "Col. Elvish Ray",
        role: "admin",
        regimentalNumber: "ADMIN-001",
        studentId: "N/A",
        rank: "Colonel",
        phone: "1234567890",
        whatsapp: "1234567890",
        approved: true,
    },
    {
        email: "harshray2007@gmail.com",
        password: "password123",
        displayName: "Maj. Vikram Batra",
        role: "manager",
        regimentalNumber: "MANAGER-001",
        studentId: "N/A",
        rank: "Major",
        phone: "1234567890",
        whatsapp: "1234567890",
        approved: true,
    },
    {
        email: "homeharshit001@gmail.com",
        password: "password123",
        displayName: "Cdt. Harsh Home",
        role: "cadet",
        regimentalNumber: "PB20SDA123457",
        studentId: "20BCS1025",
        rank: "Cadet",
        phone: "0987654321",
        whatsapp: "0987654321",
        approved: true,
    }
];

export async function seedDatabase(prevState: any, formData: FormData) {
  try {
    // Check if users already exist to avoid duplication
    const existingUsers = await Promise.all(
      usersToSeed.map(user => admin.auth().getUserByEmail(user.email).catch(() => null))
    );

    const usersToCreate = usersToSeed.filter((_, index) => !existingUsers[index]);
    
    if (usersToCreate.length === 0) {
      return {
        type: "info",
        message: "Database has already been seeded. No new users were created.",
      };
    }

    const createdUsers = await Promise.all(
      usersToCreate.map(user => admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        emailVerified: true, // Ensure emails are verified for testing
      }))
    );
    
    await Promise.all(
        createdUsers.map((userRecord, index) => {
            const user = usersToCreate[index];
            return Promise.all([
                admin.auth().setCustomUserClaims(userRecord.uid, { role: user.role }),
                admin.firestore().collection("users").doc(userRecord.uid).set({
                    uid: userRecord.uid,
                    email: user.email,
                    name: user.displayName,
                    role: user.role,
                    regimentalNumber: user.regimentalNumber,
                    studentId: user.studentId,
                    rank: user.rank,
                    phone: user.phone,
                    whatsapp: user.whatsapp,
                    approved: user.approved,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                })
            ]);
        })
    );
    
    revalidatePath("/");
    return {
      type: "success",
      message: `${createdUsers.length} user(s) have been successfully seeded.`,
    };

  } catch (error: any) {
    console.error("Database Seeding Error:", error);
    let errorMessage = "An unexpected error occurred during seeding.";
    // This catches the specific private key parsing error
    if (error.message?.includes('Failed to parse private key')) {
      errorMessage =
        'Failed to parse Firebase private key. Please ensure FIREBASE_PRIVATE_KEY in your .env file is wrapped in double quotes and correctly formatted with "\\n" for newlines.';
    } else if (error.code === 'app/invalid-credential') {
        errorMessage = 'Invalid Firebase Admin SDK credentials provided in .env file.';
    }
    return {
      type: "error",
      message: errorMessage,
    };
  }
}
