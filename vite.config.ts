import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/LeafItToMe.tsx'),
      formats: ['es'],
    },
    emptyOutDir: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    },
  },
  plugins: [react()],
})
