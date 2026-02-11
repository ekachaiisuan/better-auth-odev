import Sidebar from '@/components/inv-manage/sidebar';
import { db } from '@/db/drizzle';
import { count, eq, desc, lte, sql, and } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
import { TrendingUp } from 'lucide-react';
import ProductsChart from '@/components/inv-manage/products-chart';
import { CellPieChart } from '@/components/inv-manage/cellpie-chart';

export default async function DashboardInventoryPage() {
  const { currentUser } = await getCurrentUser();
  const userId = currentUser.id;

  const [countProduct, lowStock, recent, totalSales] = await Promise.all([
    db
      .select({ value: count() })
      .from(products)
      .where(eq(products.userId, userId)),

    db
      .select({ value: count() })
      .from(products)
      .where(
        and(
          eq(products.userId, userId),
          lte(products.quantity, products.lowStock),
        ),
      ),

    db
      .select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(desc(products.createdAt))
      .limit(5),

    db
      .select({
        total: sql<number>`sum(${products.price} * ${products.quantity})`,
      })
      .from(products)
      .where(eq(products.userId, userId)),
  ]);

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, '0')}/${String(weekStart.getDate() + 1).padStart(2, '0')}`;
    const weekProducts = recent.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

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
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProduct}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">
                    {totalProduct}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1"></TrendingUp>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Number(totalSalesAmount).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">
                    {Number(totalSalesAmount).toFixed(2)}$B
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1"></TrendingUp>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStockCount}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 ">
                    {lowStockCount}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1"></TrendingUp>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                New products per week
              </h2>
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Stock level
            </h2>
            <div className="space-y-3">
              {recent.map((product) => {
                const isLowStock =
                  product.lowStock !== null &&
                  product.quantity <= product.lowStock;

                return (
                  <div
                    key={product.id}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      isLowStock ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  >
                    <div>
                      <span>{product.name}</span>
                    </div>
                    <span>{product.quantity} units</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Efficiency
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-96 h-96">
                <CellPieChart data={recent} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
