import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { HeroUIProvider } from '@heroui/react'
import './index.css'
import { ClerkProvider } from '@clerk/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { AxiosAuthProvider } from './lib'

// Create a new router instance
const router = createRouter({ routeTree })

const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <AxiosAuthProvider>
          <RouterProvider router={router} />
        </AxiosAuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
