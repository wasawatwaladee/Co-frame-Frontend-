import { z } from "zod";


export const registerSchema = z.object({
	email: z.string().min(2, "Email or phone-number require"),
	firstName: z.string().min(2, "first name is required"),
	lastName: z.string().min(2, "last name is required"),
	password: z.string().min(4, "password at least 4 characters"),
	confirmPassword: z.string().min(4, "confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
	message: 'confirmPassword must match password',
	path: ['confirmPassword']
})

export const loginSchema = z.object({
	email: z.string().min(2, "Email or phone-number require"),
	password: z.string().min(4, "password at least 4 characters"),
})

export const googleLoginPayloadSchema = z.object({
	// ฟิลด์นี้ควรจะเป็น ID Token หรือ Code ที่ได้รับจาก Google
    accessToken: z.string().min(1, "Google ID Token/Code is required"), 
    // ถ้า Backend ต้องการระบุ Client ID ด้วย ก็สามารถเพิ่มได้
    // clientId: z.string().optional(),
});