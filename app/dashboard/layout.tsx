import Navbar from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden md:block w-62.5">
          <Sidebar />
        </div>
        <div className="p-5 w-full md:max-w-285">{children}</div>
      </div>
    </div>
  );
}
