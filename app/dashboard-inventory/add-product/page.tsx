import Sidebar from '@/components/inv-manage/sidebar';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
import { FormaddInvoice } from '@/components/inv-manage/form-add-invoice';

export default async function AddProductPage() {
  const { currentUser } = await getCurrentUser();
  const userId = currentUser.id;
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard-inventory/add-product" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h1>
              <p className="text-sm text-gray-500">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <FormaddInvoice />
        </div>
      </main>
    </div>
  );
}
