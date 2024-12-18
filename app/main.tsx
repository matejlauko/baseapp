import { AuthProvider } from '@/lib/auth/auth-provider'
import { useAuth } from '@/lib/auth/use-auth'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'

import './index.css'

console.log('ALL', import.meta.env)
console.log('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL)

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',

  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const auth = useAuth()

  if (auth.isLoading) {
    return null
  }

  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
