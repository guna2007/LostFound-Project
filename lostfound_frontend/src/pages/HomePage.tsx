import { useItems } from '@/lib/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HomePage() {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [itemsToShow, setItemsToShow] = useState(6);
  
  const { data: items = [], isLoading } = useItems({ sortBy });
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const total = items.length;
  const totalLost = items.filter((i) => i.status === 'LOST').length;
  const totalFound = items.filter((i) => i.status === 'FOUND').length;
  
  const displayedItems = items.slice(0, itemsToShow);
  const hasMore = itemsToShow < items.length;

  return (
    <>
      <div className="space-y-12">
        {/* Hero Section with Gradient Animation */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col items-start gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Find What Matters Most
              </h1>
              <p className="max-w-2xl text-lg text-white/90 leading-relaxed">
                A modern Lost &amp; Found platform connecting people with their belongings. 
                Search, report, and reunite — all in one beautiful experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/report-lost" 
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report Lost Item
              </Link>
              <Link 
                to="/report-found" 
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Report Found Item
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Cards with Hover Effects */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">Total Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{total}</div>
              </div>
              <div className="rounded-full bg-blue-100 p-4 text-blue-600 group-hover:bg-blue-200">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-orange-600">Lost Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{totalLost}</div>
              </div>
              <div className="rounded-full bg-orange-100 p-4 text-orange-600 group-hover:bg-orange-200">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-green-600">Found Items</div>
                <div className="mt-2 text-4xl font-bold text-gray-900">{totalFound}</div>
              </div>
              <div className="rounded-full bg-green-100 p-4 text-green-600 group-hover:bg-green-200">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Items Preview with Better Cards */}
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Recent Items</h2>
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              <Link to="/lost" className="text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap">
                View All →
              </Link>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="h-48 w-full rounded-xl bg-gray-200"></div>
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-16 rounded bg-gray-200"></div>
                    <div className="h-6 w-20 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No items yet</h3>
              <p className="mt-2 text-sm text-gray-600">Be the first to report a lost or found item!</p>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map(item => (
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
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'LOST' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
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
            
            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setItemsToShow(prev => prev + 6)}
                  className="group flex items-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                >
                  <span>Load More Items</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
            </>
          )}
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link 
            to="/lost" 
            className="group rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 transition-all hover:shadow-xl hover:border-blue-300"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">Browse Lost Items</h3>
                <p className="mt-2 text-sm text-gray-600">Search through reported lost items and help reunite people with their belongings.</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/found" 
            className="group rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-8 transition-all hover:shadow-xl hover:border-green-300"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-3 text-green-600 group-hover:bg-green-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600">Browse Found Items</h3>
                <p className="mt-2 text-sm text-gray-600">Check if someone has found and reported your lost item.</p>
              </div>
            </div>
          </Link>
        </section>
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
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  selectedItem.status === 'LOST' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
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
                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                  Contact Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
