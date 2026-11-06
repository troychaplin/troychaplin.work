import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { LinkProvider } from '@troychaplin/parlour-ui'
import App from './App.tsx'
import { RouterLink } from './blocks/RouterLink'
import '@troychaplin/parlour-ui/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LinkProvider component={RouterLink}>
        <App />
      </LinkProvider>
    </BrowserRouter>
  </StrictMode>,
)
