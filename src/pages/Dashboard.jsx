import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import AppIcon from '../components/AppIcon'
import UpdateStatus from '../components/UpdateStatus'
import { getAllApps, getAllReleases, getHubStats } from '../data/apps'
import {
  IconArrowRight,
  IconCheck,
  IconGrid,
  IconInfo,
  IconLayers,
  IconLock,
  IconNotes,
  IconPlus,
  IconRefresh,
  IconRocket,
  IconStore,
  IconTag,
  IconUpload,
} from '../components/icons'

const MODULES = [
  {
    icon: IconPlus,
    title: 'Add App',
    description: 'Register a new app on the hub with its name, category, icon and description.',
  },
  {
    icon: IconGrid,
    title: 'Manage Apps',
    description: 'Edit app details, change status, feature an app or remove it from the catalogue.',
  },
  {
    icon: IconUpload,
    title: 'Upload Release',
    description: 'Attach a new build file to an app and keep previous releases available.',
  },
  {
    icon: IconTag,
    title: 'Version Management',
    description: 'Track version numbers, minimum requirements and platform targets per app.',
  },
  {
    icon: IconNotes,
    title: 'Release Notes',
    description: 'Write the changelog for each release and publish it on the app page.',
  },
  {
    icon: IconRocket,
    title: 'Publish Update',
    description: 'Mark a release as live so visitors see the new version immediately.',
  },
  {
    icon: IconRefresh,
    title: 'Update Status',
    description: 'Show visitors whether their installed version is current or an update exists.',
  },
]

const ROADMAP = [
  {
    phase: 'Phase 1 · Live now',
    title: 'Foundation and public UI',
    items: [
      'Home, Apps, App Details, About and this dashboard preview',
      'Responsive layout for desktop, tablet and phone',
      'ORINZA published as the first sample app',
    ],
    tone: 'success',
  },
  {
    phase: 'Phase 2 · Next',
    title: 'Real app hosting',
    items: [
      'Owner sign-in so only ChielSam can publish',
      'Real APK download links and file storage',
      'Working Add App, Upload Release and Publish Update actions',
    ],
    tone: 'brand',
  },
  {
    phase: 'Phase 3 · Later',
    title: 'Automatic updates',
    items: [
      'In-app update checker connected to a live endpoint',
      'Release channels such as stable and beta',
      'Download statistics and install prompts',
    ],
    tone: 'warning',
  },
]

export default function Dashboard() {
  const apps = getAllApps()
  const releases = getAllReleases()
  const stats = getHubStats()

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="page-head__row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="eyebrow">Owner area</span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 1.5rem + 1.6vw, 2.8rem)' }}>Dashboard</h1>
            </div>
            <Badge tone="warning">Phase 1 preview</Badge>
          </div>
          <p className="lead">
            This is a visual preview of the management tools that CHIELSAM APP HUB will use to
            publish and update apps. Nothing here is connected to a backend yet — the buttons and
            forms are placeholders so you can see the intended workflow.
          </p>
        </div>

        <div className="dash-banner" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="dash-banner__text">
            <h2 style={{ fontSize: '1.5rem' }}>Owner sign-in comes later</h2>
            <p className="muted">
              No authentication, file uploads, Firebase, GitHub or APK hosting exist in this phase.
              The hub runs entirely on local project data, which keeps it fast and free.
            </p>
          </div>
          <div className="info-note" style={{ maxWidth: 320 }}>
            <IconInfo size={18} />
            <span>Read-only preview. Buttons below are intentionally disabled.</span>
          </div>
        </div>

        <section className="stack" style={{ gap: 'var(--space-10)' }}>
          <div>
            <h2 style={{ marginBottom: 'var(--space-5)', fontSize: '1.35rem' }}>Overview</h2>
            <div className="dash-cards">
              <div className="dash-stat">
                <span className="dash-stat__icon">
                  <IconStore size={20} />
                </span>
                <div>
                  <div className="dash-stat__value">{stats.totalApps}</div>
                  <div className="dash-stat__label">Total apps</div>
                </div>
              </div>

              <div className="dash-stat">
                <span className="dash-stat__icon">
                  <IconCheck size={20} />
                </span>
                <div>
                  <div className="dash-stat__value">{stats.available}</div>
                  <div className="dash-stat__label">Available now</div>
                </div>
              </div>

              <div className="dash-stat">
                <span className="dash-stat__icon">
                  <IconLayers size={20} />
                </span>
                <div>
                  <div className="dash-stat__value">{stats.releases}</div>
                  <div className="dash-stat__label">Releases tracked</div>
                </div>
              </div>

              <div className="dash-stat">
                <span className="dash-stat__icon">
                  <IconRocket size={20} />
                </span>
                <div>
                  <div className="dash-stat__value">Phase 2</div>
                  <div className="dash-stat__label">Publishing tools</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-head" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="section-head__text">
                <h2 style={{ fontSize: '1.35rem' }}>Management modules</h2>
                <p className="lead">
                  The seven tools the owner area will provide once publishing is connected.
                </p>
              </div>
            </div>

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
                      <span>Planned</span>
                      <button type="button" className="btn btn--ghost btn--sm" disabled>
                        {module.title}
                        <IconArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div>
            <div className="section-head" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="section-head__text">
                <h2 style={{ fontSize: '1.35rem' }}>Published apps</h2>
                <p className="lead">Each app with its current release and live update state.</p>
              </div>
              <Link to="/apps" className="section-head__link">
                View public page
                <IconArrowRight size={16} />
              </Link>
            </div>

            <div className="stack" style={{ gap: 'var(--space-5)' }}>
              {apps.map((app) => (
                <div className="card card--pad" key={app.slug}>
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
                          {app.category} · {app.platform} · v{app.version} · updated {app.updatedAt}
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Badge tone="success">{app.status}</Badge>
                          <Badge>Live</Badge>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn--secondary btn--sm" disabled>
                        <IconNotes size={15} />
                        Edit details
                      </button>
                      <button type="button" className="btn btn--primary btn--sm" disabled>
                        <IconUpload size={15} />
                        Upload release
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-5)' }}>
                    <UpdateStatus app={app} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-head" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="section-head__text">
                <h2 style={{ fontSize: '1.35rem' }}>Release history</h2>
                <p className="lead">Every published release with its notes and status.</p>
              </div>
            </div>

            <div className="timeline">
              {releases.map((release, index) => (
                <div className="timeline__item" key={`${release.appSlug}-${release.version}`}>
                  <div className="timeline__rail">
                    <span className="timeline__dot" />
                    {index < releases.length - 1 ? <span className="timeline__line" /> : null}
                  </div>

                  <div className="timeline__card">
                    <div className="timeline__head">
                      <strong>{release.appName}</strong>
                      <span className="badge badge--brand">v{release.version}</span>
                      <Badge tone="success" pulse>
                        Published
                      </Badge>
                      <span className="timeline__date" style={{ marginLeft: 'auto' }}>
                        {release.date}
                      </span>
                    </div>
                    <ul className="timeline__notes">
                      {release.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
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
            <div className="section-head" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="section-head__text">
                <h2 style={{ fontSize: '1.35rem' }}>Roadmap</h2>
                <p className="lead">What is done, what is next and what is deliberately out of scope.</p>
              </div>
            </div>

            <div className="phase-list">
              {ROADMAP.map((item) => (
                <div className="phase-item" key={item.phase}>
                  <span className="phase-item__num">{item.phase}</span>
                  <strong>{item.title}</strong>
                  <ul className="timeline__notes">
                    {item.items.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                  <span style={{ marginTop: 6 }}>
                    <Badge tone={item.tone}>{item.phase.split(' · ')[0]}</Badge>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-note">
            <IconLock size={18} />
            <span>
              Security note: this preview has no login, so nothing here is protected. Owner
              authentication will be added before any real publishing tool is enabled.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
