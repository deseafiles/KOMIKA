import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] })
  ],

  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },

  server: {
    allowedHosts: ['miguel-unsedentary-unintendedly.ngrok-free.dev'],
  },

  build: {
    target: 'es2022',
    minify: 'terser',
  },

  ssr: {
    target: 'node',
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
})
