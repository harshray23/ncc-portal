"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

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
  
  try {
    // In a real app, you would create the user in Firebase Auth and Firestore here.
    // For mock mode, we just return the data to the client to update the UI.
    const newCadetData = validatedFields.data;
    
    console.log("Mock adding cadet:", newCadetData.email);
    
    revalidatePath('/admin/manage-cadets');

    return {
      type: "success",
      message: "Cadet added successfully.",
      data: newCadetData
    };

  } catch (error: any) {
    console.error("Add Cadet Error:", error);
    return {
      type: "error",
      message: "An unexpected error occurred while adding the cadet.",
    };
  }
}

const registerCadetSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rank: z.string().min(1, "Rank is required"),
  regimentalNumber: z.string().min(1, "Regimental number is required"),
  studentId: z.string().min(1, "Student ID is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
});

export async function registerCadet(prevState: any, formData: FormData) {
  const validatedFields = registerCadetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check your input.",
    };
  }
  
  // This action is now only a mock to prevent build errors, as public
  // registration has been disabled from the UI.
  console.log("Mock registration submitted for:", validatedFields.data.email);

  return {
    type: "success",
    message: "Registration submitted for approval. You will be notified via email.",
  };
}
