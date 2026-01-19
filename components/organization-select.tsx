'use client'
import { authClient } from "@/lib/auth-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function OrganizationSelect() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const { data: organizations } = authClient.useListOrganizations()
    if (organizations == null || organizations.length === 0) {
        return null
    }

    function setActiveOrganization(organizationId: string) {
        authClient.organization.setActive({ organizationId }, {
            onError: error => {
                toast.error(error.error.message || "Failed to set organization")
            }
        })
    }

    return (
        <Select
            value={activeOrganization?.id ?? ""}
            onValueChange={(value) => {
                setActiveOrganization(value)
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
                {organizations.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                        {organization.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}