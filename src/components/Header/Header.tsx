import { NavLink } from 'react-router'
import { Container } from '../Container/Container'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import './Header.scss'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  return (
      <Container as="header" className="header" maxWidth="full" contentWidth="md">
        <div className="header__inner">
          <NavLink to="/" className="header__brand">
            Troy Chaplin
          </NavLink>

          <nav className="header__nav" aria-label="Main">
            <ul className="header__list">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  {/* NavLink sets aria-current="page" on the active route. */}
                  <NavLink to={to} end={to === '/'} className="header__link">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </Container>
  )
}
