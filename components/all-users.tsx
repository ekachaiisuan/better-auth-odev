"use client";

import { User } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { addMember } from "@/server/members";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AllUserProps {
    users: User[];
    organizationId: string;
}

export default function AllUsers({ users, organizationId }: AllUserProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddMember = async (userId: string) => {
        try {
            setIsLoading(true);
            await addMember(organizationId, userId, "member");
            toast.success("Member added successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add member");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h1>All User</h1>
            <Table>
                <TableCaption>A list of all users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.emailVerified ? "default" : "destructive"}>
                                    {user.emailVerified ? "verified" : "not verified"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAddMember(user.id)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Spinner className="size-4" /> : "Add Member"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}