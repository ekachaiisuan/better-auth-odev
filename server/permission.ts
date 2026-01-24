'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const youAreAdmin = async (organizationId: string): Promise<boolean> => {
    const { success } = await auth.api.hasPermission({
        headers: await headers(),
        body: {
            organizationId,
            permissions: {
                organization: ["update", "delete"],
            },
        },
    });

    return success === true;

}





