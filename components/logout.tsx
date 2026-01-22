'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export default function Logout() {
    const router = useRouter();
    const logout = async () => {
        await authClient.signOut();
        router.push("/login");
    };
    return (
        <div className="flex flex-row gap-2" onClick={logout}>
            <LogOutIcon className="size-4" />
            Logout
        </div>
    );
}