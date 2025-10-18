import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useItemById } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemId = id ? parseInt(id, 10) : 0;
  
  const { data: item, isLoading, isError } = useItemById(itemId);

  const handleContactOwner = () => {
    toast.success('Contact request sent! (Mock action)');
  };

  const handleReportIssue = () => {
    toast.success('Issue reported to admins! (Mock action)');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12">
          <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Item Not Found</h2>
          <p className="mt-2 text-gray-600">The item you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Main Content */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-square bg-gray-100 md:aspect-auto">
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            {item.is_flagged && (
              <div className="absolute right-4 top-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
                ⚠️ Flagged
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col p-8">
            <div className="flex-1 space-y-6">
              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                  <span
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide ${
                      item.status === 'LOST'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Description</h2>
                <p className="mt-2 text-base leading-relaxed text-gray-700">{item.description}</p>
              </div>

              {/* Category */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Category</h2>
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                    {item.ai_category}
                  </span>
                </div>
              </div>

              {/* Location */}
              {item.location && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Location</h2>
                  <div className="mt-2 flex items-center gap-2 text-gray-700">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{item.location}</span>
                  </div>
                </div>
              )}

              {/* Date */}
              {item.date && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Date</h2>
                  <div className="mt-2 flex items-center gap-2 text-gray-700">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {item.contact_info && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contact Information</h2>
                  <p className="mt-2 text-gray-700">{item.contact_info}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3 border-t pt-6">
              <Button onClick={handleContactOwner} className="w-full">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Owner
              </Button>
              <Button onClick={handleReportIssue} variant="outline" className="w-full">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="text-lg font-bold text-blue-900">Need Help?</h3>
        <p className="mt-2 text-sm text-blue-800">
          If you believe this item belongs to you or have additional information, please use the "Contact Owner" button
          above. For any issues or concerns, use the "Report Issue" button to notify our admin team.
        </p>
      </div>
    </div>
  );
}
