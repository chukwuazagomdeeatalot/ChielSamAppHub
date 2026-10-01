import { Link } from 'react-router-dom'
import { IconHeart } from './icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              C
            </span>
            <span className="brand__text">
              <span className="brand__name">ChielSam</span>
              <span className="brand__sub">App Hub</span>
            </span>
          </Link>
          <p className="muted" style={{ maxWidth: '38ch' }}>
            One home for every app ChielSam builds. Discover releases, check versions and follow
            updates in a single place.
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__title">Explore</span>
          <nav className="footer__links">
            <Link to="/">Home</Link>
            <Link to="/apps">All Apps</Link>
            <Link to="/apps/orinza">ORINZA</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </div>

        <div className="footer__col">
          <span className="footer__title">Information</span>
          <nav className="footer__links">
            <Link to="/about">About</Link>
            <Link to="/about#roadmap">Roadmap</Link>
            <Link to="/dashboard">Release Management</Link>
          </nav>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>
          © {new Date().getFullYear()} ChielSam. CHIELSAM APP HUB — Phase 1 preview.
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Built with <IconHeart size={14} /> by ChielSam
        </span>
      </div>
    </footer>
  )
}
