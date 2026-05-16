import { createRootRoute, Outlet, Link, useRouterState } from '@tanstack/react-router';
import { Show, UserButton, useUser } from '@clerk/react';
import { ToastContainer } from 'react-toastify';
import { Header, Footer } from '../components';
import { getAuthRedirectPath } from '../utils';

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isSignedIn, user } = useUser();
  const isAdmin = pathname.startsWith('/admin');

  const isSignPage = pathname.startsWith('/sign');
  const isRoleSelectorPage = pathname.startsWith('/role-selector');
  const isSitter = user?.publicMetadata?.role === 'sitter';

  const hideNav = isSignPage || isRoleSelectorPage || isSitter;

  const logoHref = isSignedIn
    ? getAuthRedirectPath(user?.publicMetadata?.role)
    : undefined;

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="sticky top-0 z-50 bg-white">
        <Header logoHref={logoHref} hideNav={hideNav}>
          <div className="flex items-center w-full gap-4">
            <Show when="signed-in">
              {!hideNav && (
                <nav className="flex flex-1 gap-4 text-[#2C694E]">
                  <Link to="/bookings" className="[&.active]:font-bold">
                    Bookings
                  </Link>
                </nav>
              )}
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
