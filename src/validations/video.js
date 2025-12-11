// src/validation/video.js
import { z } from 'zod';

export const VideoSchema = z.object({
    title: z.string().min(3, "กรุณากรอกชื่อวิดีโออย่างน้อย 3 ตัวอักษร"),
    description: z.string().min(10, "กรุณากรอกคำอธิบายอย่างน้อย 10 ตัวอักษร"),
    
    // URL วิดีโอ: บังคับและต้องเป็น URL
    videoUrl: z.string().url("รูปแบบ URL วิดีโอไม่ถูกต้อง"), 
    
    // URL รูปภาพปก: ไม่บังคับ แต่ถ้ามีค่าต้องเป็น URL
    poster: z.string().url("รูปแบบ URL รูปภาพปกไม่ถูกต้อง").or(z.literal("")),
    
    // Category ID: ต้องเป็น String ที่มีค่าอยู่
    categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
    
    // Duration: ต้องเป็นตัวเลขบวก
    duration: z.string().min(1, "กรุณากำหนดระยะเวลา")
                      .refine(val => !isNaN(Number(val)) && Number(val) > 0, 
                              "ระยะเวลาต้องเป็นตัวเลขบวกเท่านั้น"),
});