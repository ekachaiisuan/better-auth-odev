'use server'

import { db } from '@/db/drizzle';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
import { z } from 'zod';

const productFormSchema = z.object({
    name: z
        .string()
        .min(1, "กรุณากรอกชื่อสินค้า")
        .max(255, "ชื่อสินค้าต้องไม่เกิน 255 ตัวอักษร"),
    sku: z
        .string()
        .trim()
        .min(1, "กรุณากรอก SKU"),
    price: z
        .coerce
        .number()
        .min(1, "ราคาต้องมากกว่าหรือเท่ากับ 1")
        .refine((val) => Number.isFinite(val), {
            message: "ราคาต้องเป็นตัวเลข",
        })
        .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "ราคาต้องมีทศนิยมไม่เกิน 2 ตำแหน่ง",
        }),

    quantity: z
        .coerce
        .number()
        .int("จำนวนต้องเป็นจำนวนเต็ม")
        .min(0, "จำนวนต้องไม่น้อยกว่า 0"),
    lowStock: z
        .coerce
        .number()
        .int("Low Stock ต้องเป็นจำนวนเต็ม")
        .min(0, "Low Stock ต้องไม่น้อยกว่า 0")

}).refine((data) => data.lowStock < data.quantity, {
    message: "Low Stock ต้องน้อยกว่า Quantity",
    path: ["lowStock"],
})

export async function addProduct(product: unknown) {
    const { currentUser } = await getCurrentUser();
    const userId = currentUser.id;

    if (!userId) {
        return { success: false, error: "User not found" };
    }

    const parsed = productFormSchema.safeParse(product);

    if (!parsed.success) {
        return { success: false, error: parsed.error.message };
    }

    try {
        await db.insert(products).values({
            name: parsed.data.name,
            sku: parsed.data.sku,
            price: parsed.data.price.toString(),
            quantity: parsed.data.quantity,
            lowStock: parsed.data.lowStock,
            userId
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to add product" };
    }
}


