import { Link, useParams } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import Badge from '../components/Badge'
import FeatureList from '../components/FeatureList'
import ScreenshotPlaceholder from '../components/ScreenshotPlaceholder'
import UpdateStatus from '../components/UpdateStatus'
import { APP_STATUS, getAppBySlug, getAllApps } from '../data/apps'
import {
  IconArrowRight,
  IconChevronRight,
  IconDownload,
  IconImage,
  IconInfo,
  IconNotes,
  IconRefresh,
  IconTag,
  IconSmartphone,
  IconSparkle,
} from '../components/icons'

function statusTone(status) {
  if (status === APP_STATUS.AVAILABLE) return 'success'
  if (status === APP_STATUS.IN_REVIEW) return 'warning'
  return 'brand'
}

export default function AppDetails() {
  const { slug } = useParams()
  const app = getAppBySlug(slug)

  if (!app) {
    return (
      <div className="page">
        <div className="container">
          <div className="notfound">
            <span className="notfound__code">404</span>
            <h1>App not found</h1>
            <p className="lead" style={{ textAlign: 'center' }}>
              We could not find an app called “{slug}” on the hub.
            </p>
            <Link to="/apps" className="btn btn--primary">
              Back to all apps
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const others = getAllApps().filter((item) => item.slug !== app.slug)

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <IconChevronRight size={14} className="breadcrumb__sep" />
          <Link to="/apps">Apps</Link>
          <IconChevronRight size={14} className="breadcrumb__sep" />
          <span>{app.name}</span>
        </nav>

        <div className="details" style={{ marginTop: 'var(--space-8)' }}>
          <aside className="details__side">
            <div className="card details__hero">
              <div className="details__ident">
                <AppIcon app={app} size="lg" />
                <div>
                  <h1 className="details__name">{app.name}</h1>
                  <span className="details__publisher">{app.publisher}</span>
                </div>
              </div>

              <div>
                <Badge tone={statusTone(app.status)} pulse={app.status === APP_STATUS.AVAILABLE}>
                  {app.status}
                </Badge>
              </div>

              <p className="muted" style={{ fontSize: '0.95rem' }}>
                {app.tagline}
              </p>

              <div className="details__meta-grid">
                <div>
                  <span className="stat-chip__label">Version</span>
                  <strong style={{ display: 'block' }}>{app.version}</strong>
                </div>
                <div>
                  <span className="stat-chip__label">Platform</span>
                  <strong style={{ display: 'block' }}>{app.platform}</strong>
                </div>
                <div>
                  <span className="stat-chip__label">Category</span>
                  <strong style={{ display: 'block' }}>{app.category}</strong>
                </div>
                <div>
                  <span className="stat-chip__label">Size</span>
                  <strong style={{ display: 'block' }}>{app.size}</strong>
                </div>
              </div>

              <div className="details__actions">
                <button type="button" className="btn btn--primary btn--block btn--lg" disabled>
                  <IconDownload size={18} />
                  Download (coming soon)
                </button>
                <Link to="/apps" className="btn btn--ghost btn--block">
                  <IconArrowRight size={16} />
                  Browse other apps
                </Link>
              </div>
            </div>

            <div className="info-note">
              <IconInfo size={18} />
              <span>
                The download button is a placeholder in Phase 1. No APK file is hosted yet — the
                real download link will be added when hosting is connected.
              </span>
            </div>
          </aside>

          <div className="details__main">
            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconTag size={19} />
                  About this app
                </h2>
                <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Updated {app.updatedAt}
                </span>
              </div>
              <p className="soft" style={{ lineHeight: 1.75 }}>
                {app.description}
              </p>
              <FeatureList
                items={[
                  `Currently version ${app.version} on ${app.platform}`,
                  `Requires ${app.minRequirement}`,
                  'Version history and release notes kept on this page',
                ]}
              />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconImage size={19} />
                  Screenshots
                </h2>
                <span className="badge">Placeholders</span>
              </div>
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                Real screenshots will replace these frames when the app is prepared for publishing.
              </p>
              <ScreenshotPlaceholder screenshots={app.screenshots} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconSparkle size={19} />
                  What's New
                </h2>
                <span className="badge badge--brand">v{app.version}</span>
              </div>
              <ul className="whatsnew__list">
                {app.whatsNew.map((line) => (
                  <li key={line}>
                    <IconNotes size={17} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 3 }} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconRefresh size={19} />
                  Update information
                </h2>
                <span className="badge badge--warning">Phase 1 placeholder</span>
              </div>

              <UpdateStatus app={app} />

              <dl className="spec-table">
                <dt>Update channel</dt>
                <dd>{app.updateInfo.channel}</dd>
                <dt>Release channel</dt>
                <dd>{app.updateInfo.releaseChannel}</dd>
                <dt>Automatic updates</dt>
                <dd>{app.updateInfo.autoUpdate}</dd>
                <dt>Current version</dt>
                <dd>v{app.version}</dd>
                <dt>First released</dt>
                <dd>{app.releasedAt}</dd>
                <dt>Latest update</dt>
                <dd>{app.updatedAt}</dd>
                <dt>Support</dt>
                <dd>{app.updateInfo.support}</dd>
              </dl>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconSmartphone size={19} />
                  App information
                </h2>
              </div>
              <dl className="spec-table">
                <dt>App name</dt>
                <dd>{app.name}</dd>
                <dt>Publisher</dt>
                <dd>{app.publisher}</dd>
                <dt>Category</dt>
                <dd>{app.category}</dd>
                <dt>Platform</dt>
                <dd>{app.platform}</dd>
                <dt>Minimum requirement</dt>
                <dd>{app.minRequirement}</dd>
                <dt>Rating</dt>
                <dd>{app.rating}</dd>
              </dl>
            </section>

            {others.length > 0 ? (
              <section className="panel">
                <div className="panel__head">
                  <h2 className="panel__title">
                    <IconArrowRight size={19} />
                    More apps
                  </h2>
                </div>
                <div className="app-grid">
                  {others.map((item) => (
                    <div className="card card--pad" key={item.slug}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AppIcon app={item} size="sm" />
                        <div>
                          <strong>{item.name}</strong>
                          <div className="muted" style={{ fontSize: '0.84rem' }}>
                            {item.category} · v{item.version}
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/apps/${item.slug}`}
                        className="btn btn--secondary btn--sm"
                        style={{ marginTop: 14, width: 'fit-content' }}
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
