import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-primary-100 transition">
            🔍 Lost & Found
          </Link>
          <div className="hidden md:flex gap-6">
            <Link to="/lost" className="hover:text-primary-100 transition">
              Lost Items
            </Link>
            <Link to="/found" className="hover:text-primary-100 transition">
              Found Items
            </Link>
            <Link to="/report-lost" className="hover:text-primary-100 transition">
              Report Lost
            </Link>
            <Link to="/report-found" className="hover:text-primary-100 transition">
              Report Found
            </Link>
            <Link to="/dashboard" className="hover:text-primary-100 transition">
              Dashboard
            </Link>
            <Link to="/login" className="bg-white text-primary-600 px-4 py-1 rounded hover:bg-primary-50 transition">
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Lost & Found App. All rights reserved.</p>
          <p className="text-sm mt-2">Helping reunite lost items with their owners 💙</p>
        </div>
      </footer>
    </div>
  );
}
