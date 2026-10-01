import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IconClose, IconMenu, IconMoon, IconStore, IconSun } from './icons'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/apps', label: 'Apps' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
]

function getInitialTheme() {
  const stored = window.localStorage.getItem('hub-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('hub-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.classList.toggle('is-locked', menuOpen)
    return () => document.body.classList.remove('is-locked')
  }, [menuOpen])

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            C
          </span>
          <span className="brand__text">
            <span className="brand__name">ChielSam</span>
            <span className="brand__sub">App Hub</span>
          </span>
        </Link>

        <nav className={`nav__links${menuOpen ? ' is-open' : ''}`} onClick={() => setMenuOpen(false)}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          <Link to="/apps" className="btn btn--primary btn--sm">
            <IconStore size={16} />
            Browse Apps
          </Link>

          <button
            type="button"
            className="icon-btn nav__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
