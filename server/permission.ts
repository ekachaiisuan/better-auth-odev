'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const youAreAdmin = async (): Promise<boolean> => {
    const { success } = await auth.api.hasPermission({
        headers: await headers(),
        body: {
            permissions: {
                organization: ["update", "delete"],
            },
        },
    });

    return success === true;

}



