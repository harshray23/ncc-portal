"use server";

import { z } from "zod";
import admin from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  regimentalNumber: z.string().min(1, "Regimental number is required"),
  studentId: z.string().min(1, "Student ID is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  rank: z.string().min(1, "Rank is required"),
});

export async function registerCadet(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check your input.",
    };
  }
  
  const { email, password, ...profileData } = validatedFields.data;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: profileData.name,
      emailVerified: true, // Auto-verify email for simplified testing
    });
    
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "cadet" });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      ...profileData,
      role: "cadet",
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      type: "success",
      message: "Registration successful! An admin will approve your account shortly.",
    };

  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === "auth/email-already-exists") {
      errorMessage = "This email address is already in use.";
    }
    console.error("Registration Error:", error);
    return {
      type: "error",
      message: errorMessage,
    };
  }
}

export async function approveCadet(uid: string) {
    try {
        await admin.firestore().collection('users').doc(uid).update({
            approved: true,
        });
        revalidatePath('/admin/manage-cadets');
        return { success: true, message: 'Cadet approved successfully.' };
    } catch (error) {
        console.error('Error approving cadet:', error);
        return { success: false, message: 'Failed to approve cadet.' };
    }
}
