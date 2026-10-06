import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Parlour's generated Sass variables and breakpoint mixins. The file
        // isn't in the package's exports map, so it's reached by path.
        loadPaths: [
          fileURLToPath(
            new URL('./node_modules/@troychaplin/parlour-ui/dist/styles', import.meta.url),
          ),
        ],
        // Puts $parlour-* variables and the below-/above- breakpoint mixins in
        // scope for every component .scss file. It emits no CSS.
        additionalData: `@use 'parlour-variables' as *;\n`,
      },
    },
  },
})
