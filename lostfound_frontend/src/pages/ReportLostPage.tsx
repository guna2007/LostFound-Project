import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ITEM_CATEGORIES, MOCK_USER_ID } from '@/lib/utils';
import { useAddItem, useAuth } from '@/lib/hooks';

export default function ReportLostPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const addItemMutation = useAddItem();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter an item title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please specify where you lost the item');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addItemMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        ai_category: formData.category,
        location: formData.location,
        image_url: formData.imageUrl || `https://placedog.net/400/400?id=${Date.now()}`,
        status: 'LOST',
        reporter_id: userId || MOCK_USER_ID,
      });
      
      toast.success('Lost item reported successfully!');
      
      // Reset form and navigate
      setFormData({ title: '', description: '', category: '', location: '', imageUrl: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error('Failed to report item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3 text-orange-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Lost Item</h1>
            <p className="text-gray-600">Help us help you find your lost item</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Item Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="e.g., Black Leather Wallet"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-gray-500">Be specific to help others identify your item</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              placeholder="Describe the item in detail: color, brand, distinctive features, contents, etc."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Category and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              >
                <option value="">Select a category</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Last Seen Location *
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="e.g., Library 2nd Floor"
                maxLength={100}
              />
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">Add an image to help others identify your item</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Report Lost Item'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Tips for Better Results</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Be as detailed as possible in your description</li>
              <li>• Include unique features or markings</li>
              <li>• Specify the exact location where you lost it</li>
              <li>• Check back regularly for updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
