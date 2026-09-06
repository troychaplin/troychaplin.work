import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Lets partials be referenced by bare name, e.g. @use 'tokens'.
        loadPaths: [fileURLToPath(new URL('./src/styles', import.meta.url))],
        // Puts mixins and breakpoint variables in scope for every .scss entry
        // so component files need no boilerplate. _abstracts.scss emits no CSS,
        // so this costs nothing in the output.
        additionalData: `@use 'abstracts' as *;\n`,
      },
    },
  },
})
