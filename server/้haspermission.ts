'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const isAdmin = async (memberId: string) => {
    try {
        const { success, error } = await auth.api.hasPermission({
            headers: await headers(),
            body: {
                permissions: {
                    member: ["invite", "remove", "update", "create"],
                },
            },
        });

        if (error) {
            return {
                success: false,
                error: error || "Something went wrong"
            }
        }
        return success
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error || "Something went wrong"
        }

    }


}



