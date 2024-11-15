import { z } from "zod";
export const feedback_dataSchema = z.object({
  
  rating: z.number().min(1,{ message:"Rating must be at least 1"}).max(5,{message: "Rating must be 5 or less"}), // limits rating from 1 to 5
  name: z.string().min(1, {message:"Name is required"}),
  feedback: z.string().min(1,{message: "Feedback is required"}),
});

export const enquiry_dataSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string({ message: "Mobile number is required" }).min(10, { message: "Mobile number is required" }),
    message: z.string().min(1, { message: "Message is required" }),
  });