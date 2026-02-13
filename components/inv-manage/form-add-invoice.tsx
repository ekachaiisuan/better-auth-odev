"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { addProduct } from "@/server/products"

type ProductFormInput = {
    name: string
    sku: string
    price: number
    quantity: number
    lowStock: number
}

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


export function FormAddInvoice() {
    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            sku: "",
            price: 0,
            quantity: 0,
            lowStock: 0,
        },
    })

    async function onSubmit(data: ProductFormInput) {
        const result = await addProduct(data);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success("Product added successfully");
        form.reset();
    }


    return (
        <Card className="w-full sm:max-w-md">
            <CardContent>
                <form id="form-add-product" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="flex flex-col gap-2">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-add-product-name">
                                        Product Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value as string}
                                        id="form-add-product-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Product Name"
                                        autoComplete="off"
                                        type="text"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="sku"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-add-product-sku">
                                        SKU
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value as string}
                                        id="form-add-product-sku"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="SKU"
                                        autoComplete="off"
                                        type="text"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-add-product-price">
                                        Price
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value as number}
                                        id="form-add-product-price"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Price"
                                        autoComplete="off"
                                        type="number"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="quantity"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-add-product-quantity">
                                        Quantity
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value as number}
                                        id="form-add-product-quantity"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Quantity"
                                        autoComplete="off"
                                        type="number"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="lowStock"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-add-product-lowStock">
                                        Low Stock
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        value={field.value as number}
                                        id="form-add-product-lowStock"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Low Stock"
                                        autoComplete="off"
                                        type="number"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal" className="justify-end">
                    <Button type="submit" form="form-add-product">
                        Submit
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
