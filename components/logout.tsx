'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Logout() {
    const router = useRouter();
    const logout = async () => {
        await authClient.signOut();
        router.push("/login");
    };
    return (
        <Button onClick={logout}>
            Logout
            <LogOut className="size-4" />
        </Button>
    );
}