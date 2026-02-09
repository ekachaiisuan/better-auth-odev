import Sidebar from '@/components/inv-manage/sidebar';
import { db } from '@/db/drizzle';
import { count, eq, desc, lte, sql } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
import { t } from 'media-chrome';

export default async function DashboardInventoryPage() {
  const { currentUser } = await getCurrentUser();
  const userId = currentUser.id;

  const countProduct = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.userId, userId));

  const lowStock = await db
    .select({ value: count() })
    .from(products)
    .where(lte(products.quantity, products.lowStock));

  const recent = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId))
    .orderBy(desc(products.createdAt))
    .limit(5);

  const totalSales = await db
    .select({
      total: sql<number>`sum(${products.price} * ${products.quantity})`,
    })
    .from(products)
    .where(eq(products.userId, userId));

  const totalProduct = countProduct[0].value;
  const lowStockCount = Number(lowStock[0].value);
  const totalSalesAmount = Number(totalSales[0].total ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard-inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div>{totalSalesAmount}</div>
              <div>Total Products</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
