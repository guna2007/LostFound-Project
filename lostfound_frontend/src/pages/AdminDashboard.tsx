import { useItems, useUpdateItem, useDeleteItem } from '@/lib/hooks';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { data: items = [], isLoading } = useItems();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const navigate = useNavigate();
  
  const flaggedItems = items.filter((i) => i.is_flagged);
  
  const handleApprove = async (itemId: number, itemTitle: string) => {
    try {
      await updateItemMutation.mutateAsync({
        id: itemId,
        data: { is_flagged: false },
      });
      toast.success(`"${itemTitle}" approved successfully!`);
    } catch (error) {
      toast.error('Failed to approve item');
    }
  };
  
  const handleReject = async (itemId: number, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteItemMutation.mutateAsync({ id: itemId });
      toast.success(`"${itemTitle}" has been removed`);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage flagged items and moderate content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">Total Items</div>
              <div className="mt-2 text-4xl font-bold text-gray-900">{items.length}</div>
            </div>
            <div className="rounded-full bg-blue-100 p-4 text-blue-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-red-600">Flagged Items</div>
              <div className="mt-2 text-4xl font-bold text-gray-900">{flaggedItems.length}</div>
            </div>
            <div className="rounded-full bg-red-100 p-4 text-red-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-purple-600">All Items</div>
              <div className="mt-2 text-4xl font-bold text-gray-900">{items.length}</div>
            </div>
            <div className="rounded-full bg-purple-100 p-4 text-purple-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Items Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Flagged Items Review</h2>
        
        {isLoading && (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border bg-white p-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading flagged items...</p>
            </div>
          </div>
        )}
        
        {!isLoading && flaggedItems.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-bold text-gray-900">All Clear!</h3>
            <p className="mt-2 text-gray-600">No flagged items at the moment. Great job keeping the platform clean!</p>
          </div>
        )}
        
        {!isLoading && flaggedItems.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-700">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-700">Reporter</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flaggedItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="relative h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden"
                            onClick={() => navigate(`/item/${item.id}`)}
                          >
                            <img 
                              src={item.image_url} 
                              alt={item.title} 
                              className="h-full w-full object-cover hover:scale-110 transition-transform" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => navigate(`/item/${item.id}`)}
                              className="font-semibold text-gray-900 hover:text-blue-600 text-left"
                            >
                              {item.title}
                            </button>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            {item.location && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {item.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          item.status === 'LOST' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                          {item.ai_category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-mono">
                          {item.reporter_id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(item.id, item.title)}
                            disabled={updateItemMutation.isPending}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-all"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(item.id, item.title)}
                            disabled={deleteItemMutation.isPending}
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-all"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* All Items Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">All Items</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="relative overflow-hidden rounded-xl">
                {item.is_flagged && (
                  <div className="absolute right-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
                    Flagged
                  </div>
                )}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'LOST'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {item.ai_category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
