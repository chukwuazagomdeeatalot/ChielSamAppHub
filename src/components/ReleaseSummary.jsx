import Badge from './Badge'
import { getAppReleaseMeta, getReleaseStatus } from '../services/releaseService'
import { IconCheck, IconLayers, IconRocket, IconSparkle } from './icons'

/**
 * Release summary for one app, used by the dashboard.
 *
 * Shows the real recorded values only: current version, latest release and
 * release status. The "Create New Release" control is intentionally disabled -
 * creating a release needs a build pipeline and a place to store files, neither
 * of which exists yet, and this button does not pretend otherwise.
 */
export default function ReleaseSummary({ app, onCreateReleaseDisabled = true }) {
  const meta = getAppReleaseMeta(app.id)
  const status = getReleaseStatus(meta.currentRelease)

  return (
    <div className="release-summary">
      <div className="release-summary__head">
        <div>
          <span className="footer__title">{app.name}</span>
          <h3 className="release-summary__version">
            Current version: {meta.currentVersion ? `v${meta.currentVersion}` : '—'}
          </h3>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <dl className="release-summary__grid">
        <div>
          <dt>Latest release</dt>
          <dd>{meta.latestVersion ? `v${meta.latestVersion}` : '—'}</dd>
        </div>
        <div>
          <dt>Release status</dt>
          <dd>{status.label}</dd>
        </div>
        <div>
          <dt>Release date</dt>
          <dd>{meta.releaseDate || '—'}</dd>
        </div>
        <div>
          <dt>Releases recorded</dt>
          <dd>{meta.releaseCount}</dd>
        </div>
        <div>
          <dt>Minimum platform</dt>
          <dd>{meta.minimumSupportedVersion || '—'}</dd>
        </div>
        <div>
          <dt>Artifact</dt>
          <dd>{status.hasArtifact ? 'Hosted' : 'Not hosted'}</dd>
        </div>
      </dl>

      {meta.releaseNotes ? <p className="release-summary__notes">{meta.releaseNotes}</p> : null}

      <div className="release-summary__actions">
        <button type="button" className="btn btn--primary btn--sm" disabled={onCreateReleaseDisabled}>
          <IconRocket size={15} />
          Create New Release
        </button>
        <button type="button" className="btn btn--secondary btn--sm" disabled>
          <IconLayers size={15} />
          Publish
        </button>
        <span className="release-summary__hint">
          <IconSparkle size={14} />
          Future feature — needs a build pipeline and file storage
        </span>
      </div>
    </div>
  )
}

export function ReleaseStatusLegend() {
  const items = [
    { label: 'Current', tone: 'success', note: 'The version the hub presents' },
    { label: 'Superseded', tone: 'default', note: 'Older published version' },
    { label: 'Prepared', tone: 'brand', note: 'Recorded but not published' },
    { label: 'Draft', tone: 'warning', note: 'Not finished' },
  ]

  return (
    <div className="release-legend">
      {items.map((item) => (
        <div className="release-legend__item" key={item.label}>
          <Badge tone={item.tone}>{item.label}</Badge>
          <span className="muted">{item.note}</span>
        </div>
      ))}
      <div className="release-legend__item">
        <span className="feature-list__icon">
          <IconCheck size={13} />
        </span>
        <span className="muted">Only real releases are ever listed as history</span>
      </div>
    </div>
  )
}
