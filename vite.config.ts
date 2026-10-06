import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

// Google Analytics 4. Not a secret: it ends up in the page source.
const GA_MEASUREMENT_ID = 'G-E0FCWJZTDM'

// Adds the gtag.js snippet to index.html in production builds only, so local
// `pnpm dev` visits never reach the analytics.
function googleAnalytics(id: string): Plugin {
  return {
    name: 'google-analytics',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'script',
        attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` },
        injectTo: 'head-prepend',
      },
      {
        tag: 'script',
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`,
        injectTo: 'head-prepend',
      },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), googleAnalytics(GA_MEASUREMENT_ID)],
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
