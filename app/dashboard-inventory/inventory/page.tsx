import Sidebar from '@/components/inv-manage/sidebar';
import { db } from '@/db/drizzle';
import { eq, ilike, and, count, desc } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getCurrentUser } from '@/server/users';
import Pagination from '@/components/inv-manage/pagination';

export default async function Inventory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { currentUser } = await getCurrentUser();
  const userId = currentUser.id;
  const params = await searchParams;
  const pageSize = 10;

  const keyword = (params.q ?? '').trim();

  const conditions = [eq(products.userId, userId)];

  if (keyword) {
    conditions.push(ilike(products.name, `%${keyword}%`));
  }

  const whereCondition = and(...conditions);
  const currentPage = Math.max(1, Number(params.page ?? 1));

  const offset = (currentPage - 1) * pageSize;

  const [totalCount, allProducts] = await Promise.all([
    db.select({ value: count() }).from(products).where(whereCondition),
    db
      .select()
      .from(products)
      .where(whereCondition)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(products.createdAt)),
  ]);

  const total = totalCount[0]?.value ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = (formData.get('id') as string) || '';

    await db.delete(products).where(eq(products.id, id));
  };

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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form
              className="flex gap-2"
              action="/dashboard-inventory/inventory"
              method="GET"
            >
              <input
                type="text"
                name="q"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              ></input>
              <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 ">
                search
              </button>
            </form>
          </div>
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
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.lowStock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <form action={handleDelete}>
                        <input
                          type="hidden"
                          name="id"
                          value={product.id}
                        ></input>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/dashboard-inventory/inventory"
                searchParams={{
                  q: keyword,
                  page: String(pageSize),
                }}
              ></Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
