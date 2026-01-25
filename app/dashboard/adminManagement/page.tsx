import { CreateOrgForm } from "@/components/forms/create-org-form";
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
import DashboardCard from "@/components/dashboard-card";
import { Users } from "lucide-react";
import { OrganizationSwitcher } from "@/components/organization-switcher";


export default async function AdminManagement() {
    const organizations = await getOrganizations();

    return (
        <>
            <OrganizationSwitcher organizations={organizations} />
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
            <h2 className="font-bold text-2xl">Organizations</h2>
            <div className="flex flex-col md:flex-row gap-2 mb-5">
                {organizations.map((organization) => (
                    <Link href={`/dashboard/organization/${organization.slug}`} key={organization.id}>
                        <DashboardCard
                            className="w-[200px]"
                            title={organization.slug}
                            icon={<Users className="text-slate-500" size={72} />}
                            value={50}
                        />
                    </Link>
                ))}
            </div>
        </>
    );

}