import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl"></div>
          <div className="relative rounded-3xl border-2 border-gray-200 bg-white p-12 shadow-2xl">
            {/* 404 Icon */}
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              <svg className="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* 404 Text */}
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-7xl font-extrabold text-transparent">
              404
            </h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-4 text-lg text-gray-600">
              Oops! The page you're looking for seems to have gone missing. It might have been removed, renamed, or never existed in the first place.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go Home
                </Button>
              </Link>
              <Link to="/lost">
                <Button variant="outline" className="w-full sm:w-auto">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Items
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-8 border-t pt-8">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quick Links</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/lost" className="text-blue-600 hover:text-blue-700 font-semibold">Lost Items</Link>
                <span className="text-gray-300">•</span>
                <Link to="/found" className="text-blue-600 hover:text-blue-700 font-semibold">Found Items</Link>
                <span className="text-gray-300">•</span>
                <Link to="/report-lost" className="text-blue-600 hover:text-blue-700 font-semibold">Report Lost</Link>
                <span className="text-gray-300">•</span>
                <Link to="/report-found" className="text-blue-600 hover:text-blue-700 font-semibold">Report Found</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
