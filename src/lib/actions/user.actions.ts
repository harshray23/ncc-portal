"use server";

import { z } from "zod";
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
  
  try {
    // NOTE: Firebase Admin SDK calls are disabled for mock data mode.
    // This action simulates a successful registration without creating a real user.
    console.log("Mock registration for:", validatedFields.data.email);

    return {
      type: "success",
      message: "Registration successful! An admin will approve your account shortly (mock response).",
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
        // NOTE: Firebase Admin SDK calls are disabled for mock data mode.
        console.log("Mock approving cadet:", uid);
        revalidatePath('/admin/manage-cadets');
        return { success: true, message: 'Cadet approved successfully (mock response).' };
    } catch (error) {
        console.error('Error approving cadet:', error);
        return { success: false, message: 'Failed to approve cadet (mock response).' };
    }
}
