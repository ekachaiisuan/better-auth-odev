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

import Logout from "./logout";
import { getCurrentUser } from "@/server/users";
import OrganizationActive from "@/components/organization-active";




const Navbar = async () => {
    const user = await getCurrentUser();


    return (
        <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between items-center">
            <div>
                Demo
            </div>

            <div className="flex items-center gap-2">
                <div className="flex text-white">
                    welcome{" "}{user.currentUser.name}
                </div>

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

        </div>
    )

}

export default Navbar;
