import { Link } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import Badge from '../components/Badge'
import DeviceMock from '../components/DeviceMock'
import SectionHead, { PlaceholderCard } from '../components/SectionHead'
import { UpdateStatusCompact } from '../components/UpdateStatus'
import { getAllReleases, getFeaturedApps, getHubStats } from '../data/apps'
import {
  IconArrowRight,
  IconCheckCircle,
  IconDownload,
  IconShield,
  IconSparkle,
  IconStore,
} from '../components/icons'

function Hero() {
  const featured = getFeaturedApps()[0]
  const stats = getHubStats()

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">ChielSam App Hub</span>

          <h1 className="hero__title">
            Every app I build, <span className="gradient-text">in one home</span>
          </h1>

          <p className="lead">
            CHIELSAM APP HUB is the official distribution home for apps by ChielSam. Browse the
            catalogue, open any app for full details, and see exactly which version is current and
            whether a newer one exists.
          </p>

          <div className="hero__actions">
            <Link to="/apps" className="btn btn--primary btn--lg">
              <IconStore size={18} />
              Discover My Apps
            </Link>
            <Link to="/apps/orinza" className="btn btn--secondary btn--lg">
              <IconDownload size={18} />
              View ORINZA
            </Link>
          </div>

          <div className="hero__meta">
            <span>
              <IconCheckCircle size={16} />
              {stats.available} app available
            </span>
            <span>
              <IconShield size={16} />
              Single owner, verified releases
            </span>
            <span>
              <IconSparkle size={16} />
              Free, no account needed
            </span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <DeviceMock app={featured} />
          <div className="hero__float hero__float--tl" style={{ width: 240 }}>
            <UpdateStatusCompact app={featured} />
          </div>
          <div className="hero__float hero__float--br">
            <div className="card card--pad" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AppIcon app={featured} size="sm" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{featured.name}</strong>
                  <span className="muted" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                    v{featured.version} · {featured.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  const stats = getHubStats()

  const items = [
    { value: stats.totalApps, label: 'Apps published' },
    { value: stats.available, label: 'Available now' },
    { value: stats.categories, label: 'Categories' },
    { value: stats.releases, label: 'Releases tracked' },
  ]

  return (
    <div className="stat-strip">
      {items.map((item) => (
        <div className="stat-strip__item" key={item.label}>
          <span className="stat-strip__value">{item.value}</span>
          <span className="stat-strip__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function FeaturedApps() {
  const featured = getFeaturedApps()

  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Featured"
          title="Featured app"
          description="The app currently in the spotlight on the hub."
        />

        <div className="app-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
          {featured.map((app) => (
            <article className="featured" key={app.slug}>
              <div className="featured__body">
                <div className="featured__head">
                  <AppIcon app={app} size="md" />
                  <div>
                    <span className="badge badge--brand" style={{ marginBottom: 6 }}>
                      Featured
                    </span>
                    <h3 className="featured__title">{app.name}</h3>
                    <span className="app-card__category">{app.category}</span>
                  </div>
                </div>

                <p className="featured__tagline">{app.tagline}</p>
                <p className="muted">{app.description}</p>

                <div className="featured__stats">
                  <div className="stat-chip">
                    <span className="stat-chip__label">Version</span>
                    <span className="stat-chip__value">{app.version}</span>
                  </div>
                  <div className="stat-chip">
                    <span className="stat-chip__label">Platform</span>
                    <span className="stat-chip__value">{app.platform}</span>
                  </div>
                  <div className="stat-chip">
                    <span className="stat-chip__label">Status</span>
                    <span className="stat-chip__value">{app.status}</span>
                  </div>
                  <div className="stat-chip">
                    <span className="stat-chip__label">Released</span>
                    <span className="stat-chip__value">{app.releasedAt}</span>
                  </div>
                </div>

                <div className="featured__actions">
                  <Link to={`/apps/${app.slug}`} className="btn btn--primary">
                    View Details
                    <IconArrowRight size={16} />
                  </Link>
                  <UpdateStatusCompact app={app} />
                </div>
              </div>

              <div className="featured__visual">
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    placeItems: 'center',
                    gap: 16,
                    width: '100%',
                  }}
                >
                  <AppIcon app={app} size="lg" />
                  <div
                    className="card"
                    style={{ padding: 16, width: '100%', maxWidth: 260, background: 'var(--surface)' }}
                  >
                    <span className="footer__title">Latest release</span>
                    <strong style={{ display: 'block', marginTop: 6 }}>v{app.version}</strong>
                    <p className="muted" style={{ fontSize: '0.82rem' }}>
                      {app.releasedAt} · {app.platform}
                    </p>
                    <span style={{ marginTop: 10 }}>
                      <Badge tone="success">{app.status}</Badge>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <PlaceholderCard
            title="Next featured app"
            description="This slot is reserved for the next app published on the hub."
          />
        </div>
      </div>
    </section>
  )
}

function LatestUpdates() {
  const releases = getAllReleases()

  return (
    <section className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <SectionHead
          eyebrow="Changelog"
          title="Latest updates"
          description="A chronological view of every release published on the hub."
          linkTo="/dashboard"
          linkLabel="Release management"
        />

        <div className="timeline">
          {releases.map((release, index) => (
            <div className="timeline__item" key={`${release.appSlug}-${release.version}`}>
              <div className="timeline__rail">
                <span className="timeline__dot" />
                {index < releases.length - 1 ? <span className="timeline__line" /> : null}
              </div>

              <div className="timeline__card">
                <div className="timeline__head">
                  <Link to={`/apps/${release.appSlug}`} style={{ color: 'inherit' }}>
                    <strong>{release.appName}</strong>
                  </Link>
                  <span className="badge badge--brand">v{release.version}</span>
                  <span className="badge">{release.type}</span>
                  <span className="timeline__date" style={{ marginLeft: 'auto' }}>
                    {release.date}
                  </span>
                </div>

                <ul className="timeline__notes">
                  {release.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section className="section" style={{ paddingBlock: 'var(--space-12)' }}>
      <div className="container">
        <div className="trust-strip">
          <span>
            <IconCheckCircle size={16} /> Version history kept per app
          </span>
          <span>
            <IconCheckCircle size={16} /> Release notes for every update
          </span>
          <span>
            <IconCheckCircle size={16} /> Update status indicator included
          </span>
          <span>
            <IconCheckCircle size={16} /> Built and owned by ChielSam
          </span>
        </div>
      </div>
    </section>
  )
}

function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <div className="cta-band__text">
            <h2>More apps are on the way</h2>
            <p>
              ORINZA is the first release. Follow the hub to see each new app appear here with its
              own page, version history and update status.
            </p>
          </div>
          <div className="cta-band__actions">
            <Link to="/apps" className="btn btn--secondary btn--lg">
              Browse all apps
            </Link>
            <Link
              to="/about"
              className="btn btn--ghost btn--lg"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              About the hub
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container" style={{ marginTop: 'calc(var(--space-8) * -1)' }}>
        <StatsStrip />
      </div>
      <FeaturedApps />
      <LatestUpdates />
      <TrustStrip />
      <CtaBand />
    </>
  )
}
