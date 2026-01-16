import { CreateOrgForm } from "@/components/forms/create-org-form";
import Logout from "@/components/logout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getOrganizations } from "@/server/organizations";
import Link from "next/link";

export default async function Dashboard() {
    const organizations = await getOrganizations();
    console.log(organizations);

    return <div className="flex flex-col gap-2 items-center justify-center h-screen">
        <Logout />
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Organization</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to get started.
                    </DialogDescription>
                </DialogHeader>
                <CreateOrgForm />
            </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">Organizations</h2>
            {organizations.map((organization) => (
                <Button asChild key={organization.id} variant="outline">
                    <Link href={`/dashboard/organization/${organization.slug}`}>
                        {organization.name}
                    </Link>
                </Button>
            ))}
        </div>
    </div>;
}