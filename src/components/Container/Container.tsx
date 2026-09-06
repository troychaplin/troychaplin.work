import type { ReactNode } from 'react'
import './Container.scss'

export function Container({ children }: { children: ReactNode }) {
  return <div className="container">{children}</div>
}
