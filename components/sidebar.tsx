import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { ac } from "@/lib/permissions";
import { getActiveOrganizationWithUser } from "@/server/organizations";

import {
    CreditCard,
    LayoutDashboard,
    Settings,
    User,
    Birdhouse,

} from "lucide-react"
import Link from "next/link";

export const Sidebar = async () => {
    const activeOrganization = await getActiveOrganizationWithUser()
    if (!activeOrganization) {
        return null
    }

    return (
        <Command className="max-w-sm bg-secondary rounded-none">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <Link href="/dashboard">
                            Dashboard
                        </Link>
                    </CommandItem>
                    <CommandItem>
                        <Birdhouse className="mr-2 h-4 w-4" />
                        <Link href={`/dashboard/organization/${activeOrganization.slug}`}>
                            Manage {activeOrganization.slug}
                        </Link>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>
                        <User />
                        <span>Profile</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        <Settings />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}