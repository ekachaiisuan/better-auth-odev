import Image from "next/image";
import Link from "next/link";
import { AvatarDemo } from "@/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CreditCardIcon,
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react"
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { getOrganizations } from "@/server/organizations";
import Logout from "./logout";


const Navbar = async () => {
    const organizations = await getOrganizations();

    return (
        <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between items-center">
            <OrganizationSwitcher organizations={organizations} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer focus:outline-none">
                    <AvatarDemo src={"https://github.com/shadcn.png"} fallback="CN" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <UserIcon />
                        <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        <Logout />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )

}

export default Navbar;
