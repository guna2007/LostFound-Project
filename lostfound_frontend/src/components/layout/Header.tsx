import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={
        'px-3 py-2 rounded-md text-sm font-medium transition-colors ' +
        (isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50')
      }
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-semibold text-blue-700">
              Lost &amp; Found App
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/lost" label="Lost Items" />
            <NavLink to="/found" label="Found Items" />
            <NavLink to="/report-lost" label="Report Lost" />
            <NavLink to="/report-found" label="Report Found" />
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/admin" label="Admin" />
            <NavLink to="/login" label="Login" />
          </nav>

          <button
            aria-label="Toggle navigation"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 py-3">
            <div className="flex flex-col">
              <NavLink to="/" label="Home" />
              <NavLink to="/lost" label="Lost Items" />
              <NavLink to="/found" label="Found Items" />
              <NavLink to="/report-lost" label="Report Lost" />
              <NavLink to="/report-found" label="Report Found" />
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/admin" label="Admin" />
              <NavLink to="/login" label="Login" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


