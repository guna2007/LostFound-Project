import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useItems, useAuth, useDeleteItem, useUpdateItem } from '@/lib/hooks';
import { ITEM_CATEGORIES } from '@/lib/utils';
import type { IItem } from '@/types/IItem';

export default function DashboardPage() {
  const { data: items = [], isLoading } = useItems();
  const { userId } = useAuth();
  const deleteItemMutation = useDeleteItem();
  const updateItemMutation = useUpdateItem();
  
  const [editingItem, setEditingItem] = useState<IItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    ai_category: '',
    location: '',
  });
  
  // Filter items belonging to the current user
  const myItems = items.filter((i) => i.reporter_id === userId);
  const myLost = myItems.filter((i) => i.status === 'LOST');
  const myFound = myItems.filter((i) => i.status === 'FOUND');

  const handleEdit = (item: IItem) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      description: item.description,
      ai_category: item.ai_category,
      location: item.location || '',
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await updateItemMutation.mutateAsync({
        id: editingItem.id,
        data: editFormData,
      });
      toast.success('Item updated successfully!');
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteItemMutation.mutateAsync({ id });
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">Manage your reported items</p>
          </div>
          <Link
            to="/report-lost"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Report New Item
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">Total Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{myItems.length}</div>
              </div>
              <div className="rounded-full bg-blue-100 p-4 text-blue-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-orange-600">Lost Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{myLost.length}</div>
              </div>
              <div className="rounded-full bg-orange-100 p-4 text-orange-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-green-600">Found Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{myFound.length}</div>
              </div>
              <div className="rounded-full bg-green-100 p-4 text-green-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Items</h2>
          
          {isLoading && <p>Loading your items...</p>}
          
          {!isLoading && myItems.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No items yet</h3>
              <p className="mt-2 text-sm text-gray-600">Start by reporting a lost or found item</p>
              <Link
                to="/report-lost"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Report Item
              </Link>
            </div>
          )}

          {!isLoading && myItems.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
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
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {item.location}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 rounded-lg border-2 border-blue-600 bg-white px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="flex-1 rounded-lg border-2 border-red-600 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit Item</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={editFormData.ai_category}
                    onChange={(e) => setEditFormData({ ...editFormData, ai_category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    required
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateItemMutation.isPending}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateItemMutation.isPending ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
