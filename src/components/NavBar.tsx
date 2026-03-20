import { Link } from '@tanstack/react-router';

export function NavBar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-8 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <span className="font-bold text-xl">TanStack AI</span>
      </div>
      <div className="flex gap-4">
        <Link
          to="/chat"
          className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          activeProps={{ className: 'px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors' }}
        >
          Chat
        </Link>
        <Link
          to="/history"
          className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          activeProps={{ className: 'px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors' }}
        >
          History
        </Link>
      </div>
    </nav>
  );
}
