export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {year} Lost &amp; Found App
          </div>
          <div className="text-gray-500">
            Built with <span className="font-medium text-gray-700">React</span> + <span className="font-medium text-gray-700">TypeScript</span> + <span className="font-medium text-gray-700">Tailwind</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Placeholder social links */}
            <a className="hover:text-blue-600" href="#" aria-label="GitHub">GitHub</a>
            <a className="hover:text-blue-600" href="#" aria-label="Twitter">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


