import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="flex">
                <div className="hidden md:block h-[100vh] w-[250px]">
                    <Sidebar />
                </div>
                <div className="p-5 w-full md:max-w-[1140px]">
                    {children}
                </div>
            </div>

        </>
    );
}