import type { ReactNode } from 'react'
import { Container } from '../Container/Container'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import './Layout.scss'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <a className="layout__skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main className="layout__main" id="main">
        <Container>{children}</Container>
      </main>

      <Footer />
    </div>
  )
}
