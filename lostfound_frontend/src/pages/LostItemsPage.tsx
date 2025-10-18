import { useItems } from '@/lib/hooks';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_CATEGORIES } from '@/lib/utils';

export default function LostItemsPage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const { data: items = [], isLoading } = useItems({ sortBy });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = useMemo(() => {
    let filtered = items.filter((i) => i.status === 'LOST');
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.ai_category === selectedCategory);
    }
    
    return filtered;
  }, [items, searchQuery, selectedCategory]);

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Lost Items</h1>
          <p className="text-gray-600">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter and Sort */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {ITEM_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-lost" className="text-sm font-medium text-gray-700">Sort:</label>
              <select
                id="sort-lost"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="h-48 w-full rounded-xl bg-gray-200"></div>
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                <div className="mt-3 h-6 w-16 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No items found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No lost items have been reported yet'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {item.status}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {item.ai_category}
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={selectedItem.image_url}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <div className="space-y-3">
              <p className="text-gray-700">{selectedItem.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                  {selectedItem.status}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {selectedItem.ai_category}
                </span>
              </div>
              {selectedItem.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {selectedItem.location}
                </div>
              )}
              <div className="pt-4 border-t">
                <button className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700">
                  I Found This Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
