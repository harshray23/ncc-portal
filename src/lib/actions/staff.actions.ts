'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { FirebaseFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import type { UserProfile } from "../types";

// Schema for adding staff
const addStaffSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "manager"]),
  rank: z.string().min(1, "Rank is required"),
  unit: z.string().min(1, "Unit is required"),
});

// Action to add staff
export async function addStaff(prevState: any, formData: FormData) {
  const validatedFields = addStaffSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check your input.",
    };
  }

  const { email, name, role, rank, unit } = validatedFields.data;

  try {
    const admin = getFirebaseAdmin();
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return { type: 'error', message: 'A user with this email already exists.' };
    }

    const userRecord = await admin.auth().createUser({
        email,
        password: 'password123', // Default password
        displayName: name,
        emailVerified: true,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    const collectionName = `${role}s`;
    const newStaffData = {
      uid: userRecord.uid,
      name,
      email,
      role,
      rank,
      unit,
      approved: true,
      createdAt: new Date(),
    };

    await admin.firestore().collection(collectionName).doc(userRecord.uid).set(newStaffData);

    revalidatePath('/manager/manage-staff');

    return { type: "success", message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully.` };

  } catch (error: any) {
    console.error("Add Staff Error:", error);
    return { type: "error", message: error.message || "An unexpected error occurred." };
  }
}

// Helper to convert a Firestore doc to a serializable UserProfile
function docToProfile(doc: FirebaseFirestore.DocumentSnapshot): UserProfile {
    const data = doc.data()!;
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
        createdAt: data.createdAt.toDate().toISOString(),
        year: data.year,
        profilePhotoUrl: data.profilePhotoUrl,
        unit: data.unit,
    };
    return profile;
}

// Function to get all staff
export async function getStaff(): Promise<{ admins: UserProfile[], managers: UserProfile[] }> {
    try {
        const admin = getFirebaseAdmin();
        const firestore = admin.firestore();

        const adminsSnap = await firestore.collection('admins').get();
        const managersSnap = await firestore.collection('managers').get();

        const admins = adminsSnap.docs.map(docToProfile);
        const managers = managersSnap.docs.map(docToProfile);

        return { admins, managers };
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        return { admins: [], managers: [] };
    }
}


export async function deleteStaff(uid: string, role: 'admin' | 'manager'): Promise<{ success: boolean; message?: string }> {
  try {
    const admin = getFirebaseAdmin();
    const collectionName = `${role}s`;
    
    // Delete from Firestore
    await admin.firestore().collection(collectionName).doc(uid).delete();
    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    revalidatePath('/manager/manage-staff');
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete ${role}:`, error);
    return { success: false, message: error.message };
  }
}
