import { useItems } from '@/lib/hooks';

export default function AdminDashboard() {
  const { data: items = [] } = useItems();
  const flaggedItems = items.filter((i) => i.is_flagged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage flagged items and moderate content</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Flagged Items</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{flaggedItems.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">42</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Flagged Items</h2>
        {flaggedItems.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-center text-gray-600">
            No flagged items at the moment.
          </div>
        )}
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flaggedItems.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt={item.title} className="h-12 w-12 rounded object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.description.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs font-medium ${item.status === 'LOST' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.ai_category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">Approve</button>
                      <button className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
