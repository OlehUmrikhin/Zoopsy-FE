import { createRootRoute, Outlet, Link, useRouterState } from '@tanstack/react-router';
import { Show, UserButton } from '@clerk/react';
import { Header, Footer } from '../components';

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 bg-white">
        <Header>
          <div className="flex items-center w-full gap-4">
            <Show when="signed-in">
              <nav className="flex flex-1 gap-4 text-[#2C694E]">
                <Link to="/bookings" className="[&.active]:font-bold">
                  Bookings
                </Link>
              </nav>
              <UserButton />
            </Show>
          </div>
        </Header>
      </div>
      <main className="flex-1 p-0 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
