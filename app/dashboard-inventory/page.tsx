import Sidebar from '@/components/inv-manage/sidebar';
import { BarChart3 } from 'lucide-react';
export default function DashboardInventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard-inventory" />
    </div>
  );
}
