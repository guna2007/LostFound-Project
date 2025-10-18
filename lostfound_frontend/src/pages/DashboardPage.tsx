import { useItems } from '@/lib/hooks';

export default function DashboardPage() {
  const { data: items = [] } = useItems();
  
  // Mock: even IDs are "my items"
  const myItems = items.filter((i) => i.id % 2 === 0);
  const myLost = myItems.filter((i) => i.status === 'LOST');
  const myFound = myItems.filter((i) => i.status === 'FOUND');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Manage your reported items</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">My Lost Items</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{myLost.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">My Found Items</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{myFound.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Items</h2>
        {myItems.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-center text-gray-600">
            You haven't reported any items yet.
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myItems.slice(0, 6).map(item => (
            <div key={item.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <img src={item.image_url} alt={item.title} className="h-32 w-full rounded object-cover" />
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <span className={`mt-1 inline-block rounded px-2 py-1 text-xs ${item.status === 'LOST' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
