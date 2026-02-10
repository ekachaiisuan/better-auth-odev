import Sidebar from '@/components/inv-manage/sidebar';
import { db } from '@/db/drizzle';
import { count, eq, } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
export default async function Inventory() {
  const { currentUser } = await getCurrentUser();
  const userId = currentUser.id;
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId));

  return (
    <div className="flex items-center justify-center">
      <Sidebar currentPath="/dashboard-inventory/inventory" />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500">Manage your inventory</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Low Stock At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allProducts.map((product) => (
                    <tr key={product.id} className='hover:bg-gray-100'>
                        <td className='px-6 py-4 text-sm text-gray-500'>{product.name}</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{product.sku}</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{product.price}</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{product.quantity}</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{product.lowStock}</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                            <form>
                                <input type='hidden' name='id' value={product.id}></input>
                                <button className='text-red-600 hover:text-red-900'>Delete</button>
                            </form>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
