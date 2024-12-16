import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import tsconfigPaths from 'vite-tsconfig-paths'

const IS_DEV = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'baseapp.local',
    port: 3000,
  },
  plugins: [
    mkcert(),
    TanStackRouterVite({
      routesDirectory: 'app/routes',
      generatedRouteTree: 'app/routeTree.gen.ts',
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
})
