import { Link } from 'react-router-dom'
import AddAppPlaceholder from '../components/AddAppPlaceholder'
import AppIcon from '../components/AppIcon'
import Badge from '../components/Badge'
import UpdateStatus from '../components/UpdateStatus'
import { ReleaseNotes } from '../components/VersionHistory'
import {
  getAllApps,
  getAllReleases,
  getAppsWithPendingUpdates,
  getDisplayVersion,
  getHubStats,
  getStatusTone,
  isReleased,
} from '../data/apps'
import {
  IconArrowRight,
  IconCheck,
  IconGrid,
  IconInfo,
  IconLayers,
  IconLock,
  IconNotes,
  IconRefresh,
  IconRocket,
  IconStore,
  IconTag,
  IconUpload,
} from '../components/icons'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-apps', label: 'My Apps' },
  { id: 'releases', label: 'Releases' },
  { id: 'updates', label: 'Updates' },
]

const MODULES = [
  {
    icon: IconTag,
    title: 'App details',
    description: 'Edit name, category, description, features and screenshots.',
    ready: true,
  },
  {
    icon: IconLayers,
    title: 'Version history',
    description: 'Track real releases and their notes for every app.',
    ready: true,
  },
  {
    icon: IconRefresh,
    title: 'Update status',
    description: 'Show visitors whether their installed version is current.',
    ready: true,
  },
  {
    icon: IconGrid,
    title: 'Manage Apps',
    description: 'Change status, feature an app or remove it from the catalogue.',
    ready: false,
  },
  {
    icon: IconUpload,
    title: 'Upload Release',
    description: 'Attach a new build file to an app and keep previous releases.',
    ready: false,
  },
  {
    icon: IconNotes,
    title: 'Release Notes',
    description: 'Write the changelog for a release and publish it on the app page.',
    ready: false,
  },
  {
    icon: IconRocket,
    title: 'Publish Update',
    description: 'Mark a release live so visitors see the new version immediately.',
    ready: false,
  },
]

function Stat({ icon: StatIcon, value, label, tone }) {
  return (
    <div className="dash-stat">
      <span className="dash-stat__icon" style={tone ? { background: `var(--${tone}-soft)`, color: `var(--${tone})` } : undefined}>
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
    <div className="section-head" id={id} style={{ marginBottom: 'var(--space-5)', scrollMarginTop: 100 }}>
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
  const appsWithUpdates = getAppsWithPendingUpdates()

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
            Everything on this page is driven by the same app data that powers the public website.
            Publishing tools that need a server or a login are shown as clearly marked placeholders.
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
            <SectionHeading
              id="overview"
              title="Overview"
              description="Totals across every app on the hub."
            />

            <div className="dash-cards">
              <Stat icon={IconStore} value={stats.totalApps} label="Total apps" />
              <Stat icon={IconCheck} value={stats.available} label="Available now" tone="success" />
              <Stat
                icon={IconLayers}
                value={stats.latestVersion ? `v${stats.latestVersion}` : '—'}
                label={`Latest version${stats.latestReleaseApp ? ` · ${stats.latestReleaseApp}` : ''}`}
              />
              <Stat
                icon={IconRefresh}
                value={appsWithUpdates.length}
                label="Apps with a pending update"
                tone={appsWithUpdates.length > 0 ? 'warning' : 'brand'}
              />
            </div>

            <div className="info-note" style={{ marginTop: 'var(--space-5)' }}>
              <IconInfo size={18} />
              <span>
                {stats.totalApps} apps · {stats.available} available · {stats.comingSoon} coming
                soon · {stats.categories} categories · {stats.releases} real release
                {stats.releases === 1 ? '' : 's'} recorded.
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
              {apps.map((app) => (
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
                          {isReleased(app) ? ` · updated ${app.updatedAt}` : ''}
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Badge tone={getStatusTone(app.status)}>{app.status}</Badge>
                          <Badge>{app.releases.length} release{app.releases.length === 1 ? '' : 's'}</Badge>
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
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <AddAppPlaceholder />
            </div>
          </div>

          <div>
            <SectionHeading
              id="releases"
              title="Releases"
              description="Only real, published releases are listed here."
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

                    <ReleaseNotes notes={release.notes} />

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
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              id="updates"
              title="Updates"
              description="The live update state shown to visitors, and the publishing tools still to come."
            />

            <div className="stack" style={{ gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
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
                        Channel: {app.update.channel} · Automatic updates{' '}
                        {app.update.autoUpdate ? 'on' : 'off'}
                      </div>
                    </div>
                  </div>
                  <UpdateStatus app={app} />
                </div>
              ))}
            </div>

            <h3 style={{ marginBottom: 'var(--space-4)' }}>Publishing modules</h3>
            <div className="mod-grid">
              {MODULES.map((module) => {
                const ModuleIcon = module.icon

                return (
                  <article className="mod-card" key={module.title}>
                    <div className="mod-card__head">
                      <span className="mod-card__icon">
                        <ModuleIcon size={20} />
                      </span>
                      <h3 className="mod-card__title">{module.title}</h3>
                    </div>
                    <p className="mod-card__desc">{module.description}</p>
                    <div className="mod-card__foot">
                      <span>{module.ready ? 'Working' : 'Planned'}</span>
                      {module.ready ? (
                        <span className="badge badge--success">Live</span>
                      ) : (
                        <span className="badge">Future</span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="info-note">
            <IconLock size={18} />
            <span>
              This dashboard has no sign-in, so nothing here is protected. Owner authentication must
              be added before any real publishing tool is enabled. Adding an app today means adding
              an object to <code>src/data/apps.js</code> and pushing to GitHub.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
