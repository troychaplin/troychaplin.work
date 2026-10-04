import { NavLink } from 'react-router'
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
        <header className="header alignfull is-layout-constrained">
            <div className="alignwide">
                <p>
                    <NavLink to="/" className="header__brand">
                        Troy Chaplin
                    </NavLink>
                </p>

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
        </header>
    )
}
