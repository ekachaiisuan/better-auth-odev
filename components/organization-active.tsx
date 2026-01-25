"use client"

import { authClient } from "@/lib/auth-client"
import { Badge } from "./ui/badge"

export default function OrganizationActive() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    return (
        <div>
            {activeOrganization ?
                <Badge variant="secondary" className="bg-primary text-white text-xl">
                    {activeOrganization.name}
                </Badge> :
                <Badge variant="secondary" className="bg-primary text-white text-xl">
                    No active organization
                </Badge>
            }
        </div>
    )
}