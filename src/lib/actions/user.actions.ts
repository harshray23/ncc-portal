"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const addCadetSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  regimentalNumber: z.string().min(1, "Regimental number is required"),
  studentId: z.string().min(1, "Student ID is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  rank: z.string().min(1, "Rank is required"),
  year: z.string().regex(/^[1-3]$/, "Year must be 1, 2, or 3").transform(Number),
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
    const admin = getFirebaseAdmin();
     // Check if a user with this email or regimental number already exists
    const existingEmail = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingEmail) {
      return { type: 'error', message: 'A user with this email already exists.' };
    }
    const usersRef = admin.firestore().collection('users');
    const regimentalSnapshot = await usersRef.where('regimentalNumber', '==', regimentalNumber).get();
    if (!regimentalSnapshot.empty) {
        return { type: 'error', message: 'A user with this regimental number already exists.' };
    }


    // The initial password is the regimental number
    const userRecord = await admin.auth().createUser({
        email,
        password: regimentalNumber,
        displayName: name,
        emailVerified: true,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'cadet' });

    const newCadetData = {
      ...validatedFields.data,
      uid: userRecord.uid,
      role: 'cadet',
      approved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      regimentalNumberEditCount: 0,
      profilePhotoUrl: `https://placehold.co/128x128.png?text=${name.charAt(0)}`,
    };

    await usersRef.doc(userRecord.uid).set(newCadetData);
    
    revalidatePath('/admin/manage-cadets');

    return {
      type: "success",
      message: "Cadet added successfully.",
      data: newCadetData // This won't have the server timestamp resolved, but it's for client-side state update.
    };

  } catch (error: any) {
    console.error("Add Cadet Error:", error);
    return {
      type: "error",
      message: error.message || "An unexpected error occurred while adding the cadet.",
    };
  }
}
