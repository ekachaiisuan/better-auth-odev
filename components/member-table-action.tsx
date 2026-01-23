"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { removeMember } from "@/server/members";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MemberTableActionProps {
    memberId: string;
}

export default function MemberTableAction({ memberId }: MemberTableActionProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRemoveMember = async () => {
        try {
            setLoading(true);
            const result = await removeMember(memberId);
            if (result.success) {
                toast.success("Member removed successfully");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleRemoveMember} disabled={loading}>
            {loading ? <Spinner /> : "Remove"}
        </Button>
    );
}