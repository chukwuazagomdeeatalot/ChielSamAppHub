import { Link } from 'react-router-dom'
import { IconArrowRight, IconGrid, IconSearch } from '../components/icons'

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="notfound">
          <span className="notfound__code">404</span>
          <h1>Page not found</h1>
          <p className="lead" style={{ textAlign: 'center' }}>
            That page does not exist on CHIELSAM APP HUB. It may have been moved, or the link might
            be incorrect.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn--primary">
              Back to home
            </Link>
            <Link to="/apps" className="btn btn--secondary">
              <IconGrid size={17} />
              Browse apps
            </Link>
          </div>
          <div className="card card--pad" style={{ maxWidth: 460, width: '100%' }}>
            <span className="footer__title">Try these instead</span>
            <div className="footer__links" style={{ marginTop: 12 }}>
              <Link to="/">
                <IconSearch size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
                Home
              </Link>
              <Link to="/apps">
                <IconArrowRight size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
                All apps
              </Link>
              <Link to="/apps/orinza">
                <IconArrowRight size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
                ORINZA
              </Link>
              <Link to="/dashboard">
                <IconArrowRight size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
                Dashboard
              </Link>
              <Link to="/about">
                <IconArrowRight size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: -3 }} />
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
