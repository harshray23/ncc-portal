'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import type { UserProfile } from "../types";
import { getCurrentUser } from "../auth";
import { logActivity } from "./activity.actions";

const addCadetSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  regimentalNumber: z.string().min(1, "Regimental number is required"),
  studentId: z.string().min(1, "Student ID is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  whatsapp: z.string().regex(/^\d{10}$/, "WhatsApp number must be 10 digits."),
  rank: z.string().min(1, "Rank is required"),
  year: z.string().regex(/^[1-3]$/, "Year must be 1, 2, or 3").transform(Number),
  unit: z.string().min(1, "Unit is required"),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty."),
  rank: z.string().min(1, "Rank cannot be empty."),
  unit: z.string().min(1, "Unit cannot be empty."),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  whatsapp: z.string().regex(/^\d{10}$/, "WhatsApp number must be 10 digits."),
});

const adminUpdateCadetSchema = z.object({
  name: z.string().min(1, "Name cannot be empty."),
  rank: z.string().min(1, "Rank cannot be empty."),
  year: z.number().min(1).max(3),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  regimentalNumber: z.string().min(1, "Regimental number cannot be empty."),
});

export async function addCadet(prevState: any, formData: FormData) {
  const validatedFields = addCadetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check your input.",
    };
  }
  
  const { email, regimentalNumber, name } = validatedFields.data;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { type: 'error', message: 'Permission denied.' };
    }

    const admin = getFirebaseAdmin();
    const existingEmail = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingEmail) {
      return { type: 'error', message: 'A user with this email already exists.' };
    }
    
    const cadetsRef = admin.firestore().collection('cadets');
    const regimentalSnapshot = await cadetsRef.where('regimentalNumber', '==', regimentalNumber).get();
    if (!regimentalSnapshot.empty) {
        return { type: 'error', message: 'A user with this regimental number already exists.' };
    }

    const userRecord = await admin.auth().createUser({
        email,
        password: regimentalNumber, // Initial password
        displayName: name,
        emailVerified: true,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'cadet' });

    const newCadetData = {
      ...validatedFields.data,
      uid: userRecord.uid,
      role: 'cadet',
      approved: true,
      createdAt: new Date(),
      regimentalNumberEditCount: 0,
      profilePhotoUrl: `https://placehold.co/128x128.png?text=${name.charAt(0)}`,
    };

    await cadetsRef.doc(userRecord.uid).set(newCadetData);
    
    await logActivity('New User', {
        userId: currentUser.uid,
        user: currentUser.name,
        role: currentUser.role,
        details: `Added new cadet: ${validatedFields.data.name} (${validatedFields.data.email}).`
    });

    revalidatePath('/admin/manage-cadets');
    revalidatePath('/manager/activity');

    return { type: "success", message: "Cadet added successfully." };

  } catch (error: any) {
    console.error("Add Cadet Error:", error);
    return { type: "error", message: error.message || "An unexpected error occurred." };
  }
}

function convertDocToProfile(doc: FirebaseFirestore.DocumentSnapshot): UserProfile {
    const data = doc.data();
    if (!data) throw new Error('Document data is empty.');
    return {
        ...data,
        uid: doc.id,
        createdAt: data.createdAt.toDate().toISOString(),
    } as UserProfile;
}

export async function getCadets(): Promise<UserProfile[]> {
  try {
    const admin = getFirebaseAdmin();
    const usersSnapshot = await admin.firestore().collection('cadets').orderBy('createdAt', 'desc').get();
    return usersSnapshot.docs.map(convertDocToProfile);
  } catch (error) {
    console.error("Failed to fetch cadets:", error);
    return [];
  }
}

export async function updateUserProfile(profileData: UserProfile): Promise<{ success: boolean; message?: string, errors?: Record<string, string[] | undefined> }> {
  const validatedFields = updateProfileSchema.safeParse({
    name: profileData.name,
    rank: profileData.rank,
    unit: profileData.unit,
    phone: profileData.phone,
    whatsapp: profileData.whatsapp,
  });

  if (!validatedFields.success) {
      return {
          success: false,
          message: "Please correct the errors below.",
          errors: validatedFields.error.flatten().fieldErrors,
      };
  }
  
  try {
    const admin = getFirebaseAdmin();
    const { uid, role, ...dataToUpdate } = profileData;
    const collectionName = `${role}s`;
    
    const docRef = admin.firestore().collection(collectionName).doc(uid);
    
    await docRef.update({ ...dataToUpdate, createdAt: new Date(dataToUpdate.createdAt) });
    
    await logActivity('Profile Update', {
        userId: profileData.uid,
        user: profileData.name,
        role: profileData.role,
        details: `Updated their own profile.`
    });

    revalidatePath(`/${role}/profile`);
    revalidatePath(`/${role}/dashboard`);
    revalidatePath('/manager/activity');

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateCadet(cadetData: UserProfile): Promise<{ success: boolean; message?: string, errors?: Record<string, string[] | undefined> }> {
   const validatedFields = adminUpdateCadetSchema.safeParse({
    name: cadetData.name,
    rank: cadetData.rank,
    year: cadetData.year,
    phone: cadetData.phone,
    regimentalNumber: cadetData.regimentalNumber,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const admin = getFirebaseAdmin();
    const { uid, ...dataToUpdate } = cadetData;
    
    const userRef = admin.firestore().collection('cadets').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        return { success: false, message: 'Cadet not found.' };
    }
    const originalData = doc.data() as UserProfile;

    let finalData: any = { ...dataToUpdate };
    
    // Ensure createdAt is a Date object for Firestore
    finalData.createdAt = new Date(finalData.createdAt);


    if (finalData.regimentalNumber !== originalData.regimentalNumber) {
        const editCount = originalData.regimentalNumberEditCount ?? 0;
        if (editCount < 2) {
            finalData.regimentalNumberEditCount = editCount + 1;
        } else {
            finalData.regimentalNumber = originalData.regimentalNumber; 
        }
    }
    
    await userRef.update(finalData);
    
    revalidatePath('/admin/manage-cadets');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update cadet:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteCadet(uid: string): Promise<{ success: boolean; message?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, message: 'Permission denied.' };
    }
    
    const admin = getFirebaseAdmin();
    
    const cadetDoc = await admin.firestore().collection('cadets').doc(uid).get();
    const cadetName = cadetDoc.data()?.name || `UID: ${uid}`;

    // Delete from Firestore
    await admin.firestore().collection('cadets').doc(uid).delete();
    // Delete from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    await logActivity('Staff Delete', {
        userId: currentUser.uid,
        user: currentUser.name,
        role: currentUser.role,
        details: `Deleted cadet account: ${cadetName}`
    });

    revalidatePath('/admin/manage-cadets');
    revalidatePath('/manager/activity');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete cadet:", error);
    return { success: false, message: error.message };
  }
}

export async function updateCadetYears(uids: string[], year: number): Promise<{ success: boolean; message?: string }> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return { success: false, message: 'Permission denied.' };
        }

        const admin = getFirebaseAdmin();
        const batch = admin.firestore().batch();
        const usersRef = admin.firestore().collection('cadets');
        uids.forEach(uid => {
            batch.update(usersRef.doc(uid), { year: year });
        });
        await batch.commit();
        
        await logActivity('Year Update', {
            userId: currentUser.uid,
            user: currentUser.name,
            role: currentUser.role,
            details: `Updated year for ${uids.length} cadet(s) to year ${year}.`
        });

        revalidatePath('/admin/manage-year');
        revalidatePath('/manager/activity');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update cadet years:", error);
        return { success: false, message: error.message };
    }
}
