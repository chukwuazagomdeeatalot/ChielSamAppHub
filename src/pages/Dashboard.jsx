import { Link } from 'react-router-dom'
import AddAppPlaceholder from '../components/AddAppPlaceholder'
import AppIcon from '../components/AppIcon'
import Badge from '../components/Badge'
import ReleaseSummary, { ReleaseStatusLegend } from '../components/ReleaseSummary'
import UpdateStatus from '../components/UpdateStatus'
import { ReleaseNotes } from '../components/VersionHistory'
import { getAllApps, getStatusTone } from '../data/apps'
import {
  getAllReleases,
  getAppReleaseMeta,
  getAppsWithPreparedUpdates,
  getDisplayVersion,
  getHubStats,
  getReleaseStatus,
} from '../services/releaseService'
import {
  IconArrowRight,
  IconCheck,
  IconInfo,
  IconLock,
  IconNotes,
  IconRefresh,
  IconRocket,
  IconStore,
  IconUpload,
} from '../components/icons'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-apps', label: 'My Apps' },
  { id: 'releases', label: 'Releases' },
  { id: 'updates', label: 'Updates' },
]

function Stat({ icon: StatIcon, value, label, tone }) {
  return (
    <div className="dash-stat">
      <span
        className="dash-stat__icon"
        style={
          tone
            ? { background: `var(--${tone}-soft)`, color: `var(--${tone})` }
            : undefined
        }
      >
        <StatIcon size={20} />
      </span>
      <div>
        <div className="dash-stat__value">{value}</div>
        <div className="dash-stat__label">{label}</div>
      </div>
    </div>
  )
}

function SectionHeading({ id, title, description, linkTo, linkLabel }) {
  return (
    <div
      className="section-head"
      id={id}
      style={{ marginBottom: 'var(--space-5)', scrollMarginTop: 100 }}
    >
      <div className="section-head__text">
        <h2 style={{ fontSize: '1.35rem' }}>{title}</h2>
        <p className="lead">{description}</p>
      </div>
      {linkTo ? (
        <Link to={linkTo} className="section-head__link">
          {linkLabel}
          <IconArrowRight size={16} />
        </Link>
      ) : null}
    </div>
  )
}

export default function Dashboard() {
  const apps = getAllApps()
  const releases = getAllReleases()
  const stats = getHubStats()
  const preparedUpdates = getAppsWithPreparedUpdates()

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="page-head__row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="eyebrow">Owner area</span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 1.5rem + 1.6vw, 2.8rem)' }}>Dashboard</h1>
            </div>
            <Badge tone="warning">Preview — no backend</Badge>
          </div>
          <p className="lead">
            Release information comes from real release records. Anything that would need a server,
            a login or a build pipeline is shown as a clearly marked future control.
          </p>
        </div>

        <nav className="dash-nav" aria-label="Dashboard sections">
          {SECTIONS.map((section) => (
            <a className="dash-nav__link" href={`#${section.id}`} key={section.id}>
              {section.label}
            </a>
          ))}
        </nav>

        <section className="stack" style={{ gap: 'var(--space-12)' }}>
          <div>
            <SectionHeading id="overview" title="Overview" description="Totals across the hub." />

            <div className="dash-cards">
              <Stat icon={IconStore} value={stats.totalApps} label="Total apps" />
              <Stat
                icon={IconCheck}
                value={stats.available}
                label="Available now"
                tone="success"
              />
              <Stat
                icon={IconRocket}
                value={stats.latestVersion ? `v${stats.latestVersion}` : '—'}
                label={`Latest release${stats.latestReleaseApp ? ` · ${stats.latestReleaseApp}` : ''}`}
              />
              <Stat
                icon={IconRefresh}
                value={preparedUpdates.length}
                label="Prepared updates"
                tone={preparedUpdates.length > 0 ? 'warning' : 'brand'}
              />
            </div>

            <div className="info-note" style={{ marginTop: 'var(--space-5)' }}>
              <IconInfo size={18} />
              <span>
                {stats.totalApps} app{stats.totalApps === 1 ? '' : 's'} · {stats.available}{' '}
                available · {stats.releases} real release{stats.releases === 1 ? '' : 's'} ·{' '}
                {stats.currentReleases} marked as current.
              </span>
            </div>
          </div>

          <div>
            <SectionHeading
              id="my-apps"
              title="My Apps"
              description="Every app in the catalogue, generated from the data source."
              linkTo="/apps"
              linkLabel="View public catalogue"
            />

            <div className="stack" style={{ gap: 'var(--space-5)' }}>
              {apps.map((app) => {
                const release = getAppReleaseMeta(app.id)

                return (
                  <div className="card card--pad" key={app.id}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-4)',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <AppIcon app={app} size="md" />
                        <div>
                          <strong style={{ fontSize: '1.05rem' }}>{app.name}</strong>
                          <div className="muted" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                            {app.category} · {app.platform} · {getDisplayVersion(app)}
                            {release.releaseDate ? ` · released ${release.releaseDate}` : ''}
                          </div>
                          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Badge tone={getStatusTone(app.status)}>{app.status}</Badge>
                            <Badge tone={release.releaseStatus.tone}>
                              {release.releaseStatus.label}
                            </Badge>
                            {app.featured ? <Badge tone="brand">Featured</Badge> : null}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <Link to={`/apps/${app.slug}`} className="btn btn--secondary btn--sm">
                          View page
                        </Link>
                        <button type="button" className="btn btn--primary btn--sm" disabled>
                          <IconUpload size={15} />
                          Upload release
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <AddAppPlaceholder />
            </div>
          </div>

          <div>
            <SectionHeading
              id="releases"
              title="Releases"
              description="Every recorded release, with its real status."
            />

            <div className="stack" style={{ gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              {apps.map((app) => (
                <ReleaseSummary app={app} key={app.id} />
              ))}
            </div>

            <div style={{ marginBottom: 'var(--space-8)' }}>
              <ReleaseStatusLegend />
            </div>

            <div className="timeline">
              {releases.map((release, index) => {
                const status = getReleaseStatus(release)

                return (
                  <div className="timeline__item" key={`${release.appId}-${release.version}`}>
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
                        <span className={`badge badge--${status.tone}`}>{status.label}</span>
                        <span className="timeline__date" style={{ marginLeft: 'auto' }}>
                          {release.releaseDate}
                        </span>
                      </div>

                      <div className="version-entry__meta">
                        <span>{release.platform}</span>
                        <span>Min {release.minimumSupportedVersion}</span>
                        <span>Channel {release.channel}</span>
                        <span>Artifact: {status.hasArtifact ? 'Hosted' : 'Not hosted'}</span>
                      </div>

                      {release.releaseNotes ? (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                          {release.releaseNotes}
                        </p>
                      ) : null}

                      <ReleaseNotes notes={release.changes} />

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn--ghost btn--sm" disabled>
                          <IconNotes size={14} />
                          Edit notes
                        </button>
                        <button type="button" className="btn btn--ghost btn--sm" disabled>
                          <IconRocket size={14} />
                          Publish update
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <SectionHeading
              id="updates"
              title="Updates"
              description="The update state shown to visitors for each app."
            />

            <div className="stack" style={{ gap: 'var(--space-5)' }}>
              {apps.map((app) => (
                <div className="card card--pad" key={app.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <AppIcon app={app} size="sm" />
                    <div>
                      <strong>{app.name}</strong>
                      <div className="muted" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        Channel {app.update.channel} · automatic updates{' '}
                        {app.update.autoUpdate ? 'on' : 'not available'}
                      </div>
                    </div>
                  </div>
                  <UpdateStatus app={app} />
                </div>
              ))}
            </div>
          </div>

          <div className="info-note">
            <IconLock size={18} />
            <span>
              This dashboard has no sign-in, so nothing here is protected. Owner authentication must
              be added before any real publishing tool is enabled. Adding an app today means adding
              an object to <code>src/data/apps.js</code> plus its releases in{' '}
              <code>src/data/releases.js</code>, then pushing to GitHub.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
