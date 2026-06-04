import { createRootRoute, Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Show, UserButton, useUser } from '@clerk/react';
import { ToastContainer } from 'react-toastify';
import { Header, Footer, MicroserviceStatsModal } from '../components';
import { getAuthRedirectPath } from '../utils';
import { MdSettings } from 'react-icons/md';

function RootComponent() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isSignedIn, user } = useUser();
  const isAdmin = pathname.startsWith('/admin');
  const isModerator = pathname.startsWith('/moderator');

  const isSignPage = pathname.startsWith('/sign');
  const isRoleSelectorPage = pathname.startsWith('/role-selector');
  //const isSitter = user?.publicMetadata?.role === 'sitter';

  const hideNav = isSignPage || isRoleSelectorPage;

  const logoHref = isSignedIn ? getAuthRedirectPath(user?.publicMetadata?.role) : undefined;

  if (isAdmin || isModerator) {
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
                <nav className="flex flex-1 items-center gap-4 text-[#2C694E] justify-end mr-4">
                  <MicroserviceStatsModal />
                  <Link to="/bookings" className="[&.active]:font-bold ml-2">
                    Бронювання
                  </Link>
                </nav>
              )}
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Профіль"
                    labelIcon={<MdSettings size={16} />}
                    onClick={() => navigate({ to: '/profile' })}
                  />
                </UserButton.MenuItems>
              </UserButton>
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
