import { Link, useParams } from 'react-router-dom'
import AppCard from '../components/AppCard'
import AppIcon from '../components/AppIcon'
import ArtifactPanel from '../components/ArtifactPanel'
import Badge from '../components/Badge'
import DownloadButton from '../components/DownloadButton'
import FeatureList from '../components/FeatureList'
import ScreenshotPlaceholder from '../components/ScreenshotPlaceholder'
import UpdateFlowPreview from '../components/UpdateFlowPreview'
import UpdateStatus from '../components/UpdateStatus'
import VersionHistory, { ReleaseNotes } from '../components/VersionHistory'
import useUpdateStatus from '../hooks/useUpdateStatus'
import { getAppBySlug, getAllApps, getStatusTone } from '../data/apps'
import { getAppReleaseMeta } from '../services/releaseService'
import {
  IconArrowRight,
  IconChevronRight,
  IconImage,
  IconInfo,
  IconPackage,
  IconRefresh,
  IconSmartphone,
  IconSparkle,
  IconTag,
} from '../components/icons'

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

  const { data: update } = useUpdateStatus(app)
  const release = getAppReleaseMeta(app.id)
  const others = getAllApps().filter((item) => item.id !== app.id)

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

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge tone={getStatusTone(app.status)} pulse={release.isReleased}>
                  {app.status}
                </Badge>
                <span className="badge badge--brand">
                  {release.isReleased ? `v${release.currentVersion}` : 'Not released'}
                </span>
              </div>

              <p className="muted" style={{ fontSize: '0.95rem' }}>
                {app.tagline}
              </p>

              <div className="details__meta-grid">
                <div>
                  <span className="stat-chip__label">Current version</span>
                  <strong style={{ display: 'block' }}>
                    {release.isReleased ? `v${release.currentVersion}` : '—'}
                  </strong>
                </div>
                <div>
                  <span className="stat-chip__label">Release date</span>
                  <strong style={{ display: 'block' }}>{release.releaseDate || '—'}</strong>
                </div>
                <div>
                  <span className="stat-chip__label">Platform</span>
                  <strong style={{ display: 'block' }}>{app.platform}</strong>
                </div>
                <div>
                  <span className="stat-chip__label">File size</span>
                  <strong style={{ display: 'block' }}>
                    {app.download.sizeMb ? `${app.download.sizeMb} MB` : 'Not hosted'}
                  </strong>
                </div>
              </div>

              <div className="details__actions">
                <DownloadButton app={app} update={update} />
                <Link to="/apps" className="btn btn--ghost btn--block">
                  <IconArrowRight size={16} />
                  Browse other apps
                </Link>
              </div>
            </div>

            <div className="card card--pad">
              <span className="footer__title">Platform information</span>
              <dl className="spec-table" style={{ marginTop: 14, gridTemplateColumns: '1fr' }}>
                <dt>Platform</dt>
                <dd>{app.platform}</dd>
                <dt>Minimum version</dt>
                <dd>{app.platformDetails.minimum}</dd>
                <dt>Architectures</dt>
                <dd>{app.platformDetails.architectures}</dd>
                <dt>Requirements</dt>
                <dd>{app.platformDetails.requirements}</dd>
              </dl>
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
                  {release.isReleased ? `Released ${release.releaseDate}` : 'Not yet released'}
                </span>
              </div>
              <p className="soft" style={{ lineHeight: 1.75 }}>
                {app.description}
              </p>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconSparkle size={19} />
                  Features
                </h2>
                <span className="badge">{app.features.length}</span>
              </div>
              <FeatureList items={app.features} />
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
                Real screenshots will replace these frames when {app.name} is prepared for
                publishing.
              </p>
              <ScreenshotPlaceholder screenshots={app.screenshots} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconPackage size={19} />
                  Current release
                </h2>
                {release.isReleased ? (
                  <span className="badge badge--success">v{release.currentVersion}</span>
                ) : (
                  <span className="badge">No release</span>
                )}
              </div>

              {release.currentRelease ? (
                <dl className="spec-table">
                  <dt>App</dt>
                  <dd>{app.name}</dd>
                  <dt>Version</dt>
                  <dd>v{release.currentVersion}</dd>
                  <dt>Release date</dt>
                  <dd>{release.releaseDate}</dd>
                  <dt>Platform</dt>
                  <dd>{release.currentRelease.platform}</dd>
                  <dt>Minimum supported</dt>
                  <dd>{release.minimumSupportedVersion}</dd>
                  <dt>Channel</dt>
                  <dd>{release.currentRelease.channel}</dd>
                  <dt>Release status</dt>
                  <dd>{release.releaseStatus.label}</dd>
                  <dt>Artifact</dt>
                  <dd>{release.releaseStatus.hasArtifact ? 'Hosted' : 'Not hosted'}</dd>
                </dl>
              ) : (
                <p className="muted">
                  {app.name} has not been released yet, so there is no current release to show.
                </p>
              )}

              <h3 style={{ fontSize: '0.95rem', marginTop: 'var(--space-2)' }}>What's New</h3>
              <ReleaseNotes notes={release.whatsNew} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconRefresh size={19} />
                  Version history
                </h2>
                <span className="badge badge--brand">
                  {release.releaseCount} release{release.releaseCount === 1 ? '' : 's'}
                </span>
              </div>
              <VersionHistory app={app} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconRefresh size={19} />
                  Update status
                </h2>
                <span className="badge badge--warning">No backend yet</span>
              </div>

              <UpdateStatus app={app} />

              <p className="muted" style={{ fontSize: '0.88rem' }}>
                Update results are read from the release records stored in this project. No Android
                update is downloaded or installed automatically — an update means a visitor fetches
                a newer build from this page.
              </p>

              <UpdateFlowPreview currentVersion={release.currentVersion || '1.0.0'} />
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">
                  <IconPackage size={19} />
                  Build artifacts
                </h2>
                <span className="badge">Model only</span>
              </div>
              <ArtifactPanel app={app} />
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
                <dt>App ID</dt>
                <dd>{app.id}</dd>
                <dt>Publisher</dt>
                <dd>{app.publisher}</dd>
                <dt>Category</dt>
                <dd>{app.category}</dd>
                <dt>Platform</dt>
                <dd>{app.platform}</dd>
                <dt>Current version</dt>
                <dd>{release.isReleased ? `v${release.currentVersion}` : 'Not released'}</dd>
                <dt>Releases recorded</dt>
                <dd>{release.releaseCount}</dd>
                <dt>Update channel</dt>
                <dd>{app.update.channel}</dd>
                <dt>Automatic updates</dt>
                <dd>{app.update.autoUpdate ? 'Enabled' : 'Not available'}</dd>
                <dt>Support</dt>
                <dd>{app.update.support}</dd>
              </dl>
            </section>

            <div className="info-note">
              <IconInfo size={18} />
              <span>
                No APK file is hosted for {app.name}. The download button stays disabled until a real
                file is uploaded — it never points to a made-up link.
              </span>
            </div>

            {others.length > 0 ? (
              <section className="panel">
                <div className="panel__head">
                  <h2 className="panel__title">
                    <IconArrowRight size={19} />
                    More apps
                  </h2>
                  <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {others.length} other app{others.length === 1 ? '' : 's'} on the hub
                  </span>
                </div>
                <div className="app-grid">
                  {others.map((item) => (
                    <AppCard app={item} key={item.id} />
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
