'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { Spinner } from "../ui/spinner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
})

export function CreateOrgForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const res = await authClient.organization.create({
                name: values.name,
                slug: values.slug,
            });
            router.refresh();
            if (res.error) {
                toast.error(res.error.message || "Failed to create organization");
            } else {
                form.reset();
                setIsLoading(false);
                await authClient.organization.setActive({
                    organizationId: res.data.id
                });
                toast.success("Organization created successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to create organization");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="create-org-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="create-org-form-name">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="create-org-form-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="My Organization"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="create-org-form-slug">
                                Slug
                            </FieldLabel>
                            <Input
                                {...field}
                                id="create-org-form-slug"
                                aria-invalid={fieldState.invalid}
                                placeholder="my-organization"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button disabled={isLoading} type="submit">
                    {isLoading ? <Spinner className="size-4" /> : "Create Organization"}
                </Button>
            </FieldGroup>
        </form>
    )
}