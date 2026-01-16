"use server";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
    });

    if (!currentUser) {
        redirect("/login");
    }

    return {
        ...session,
        currentUser,
    };
};

export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })
        return {
            success: true,
            message: "User signed in successfully",
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "Something went wrong",
        }
    }

}

export const signUp = async (email: string, password: string, username: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: username,
            }
        })
        return {
            success: true,
            message: "User signed up successfully",
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "Something went wrong",
        }
    }

}