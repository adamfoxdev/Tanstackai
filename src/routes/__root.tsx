import { createRootRoute, Outlet } from '@tanstack/react-router';
import { NavBar } from '../components/NavBar';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
