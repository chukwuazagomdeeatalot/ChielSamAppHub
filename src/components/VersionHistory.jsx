import {
  getAppReleaseMeta,
  getPreparedRelease,
  getReleaseStatus,
  getReleasesForApp,
} from '../services/releaseService'
import { IconCheck, IconInfo, IconNotes, IconRocket, IconSparkle } from './icons'

/**
 * Version history for one app, read from the release service.
 *
 * Only genuine releases are listed. The dashed block is clearly marked as an
 * example of how a future update entry will look, so a version that does not
 * exist is never presented as real history.
 */
export default function VersionHistory({ app, showFutureExample = true }) {
  const releases = getReleasesForApp(app.id)
  const meta = getAppReleaseMeta(app.id)
  const prepared = getPreparedRelease(app.id)

  if (!meta.isReleased && releases.length === 0) {
    return (
      <div className="version-history">
        <div className="version-empty">
          <IconInfo size={18} />
          <span>
            No releases yet. {app.name} has not been published, so there is no version history to
            show.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="version-history">
      {releases.map((release, index) => {
        const status = getReleaseStatus(release)

        return (
          <div className="version-entry" key={release.version}>
            <div className="version-entry__rail">
              <span
                className={`version-entry__dot${status.isCurrent ? ' is-current' : ''}${
                  release.status === 'prepared' ? ' is-pending' : ''
                }`}
              />
              {index < releases.length - 1 ? <span className="version-entry__line" /> : null}
            </div>

            <div
              className={`version-entry__card${
                status.isCurrent ? ' version-entry__card--current' : ''
              }`}
            >
              <div className="version-entry__head">
                <span className="version-entry__number">v{release.version}</span>

                {status.isCurrent ? (
                  <span className="badge badge--success">
                    <IconCheck size={12} />
                    Current release
                  </span>
                ) : (
                  <span className="badge">{status.label}</span>
                )}

                <span className="timeline__date" style={{ marginLeft: 'auto' }}>
                  {release.releaseDate}
                </span>
              </div>

              <div className="version-entry__meta">
                <span>Released {release.releaseDate}</span>
                <span>{release.platform}</span>
                <span>Min {release.minimumSupportedVersion}</span>
                <span>Channel {release.channel}</span>
                <span>
                  Artifact: {status.hasArtifact ? release.artifactName : 'Not hosted'}
                </span>
              </div>

              {release.releaseNotes ? (
                <p className="version-entry__notes">{release.releaseNotes}</p>
              ) : null}

              <ul className="timeline__notes">
                {release.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}

      {prepared ? (
        <div className="version-entry">
          <div className="version-entry__rail">
            <span className="version-entry__dot is-pending" />
          </div>
          <div className="version-entry__card version-entry__card--pending">
            <div className="version-entry__head">
              <span className="version-entry__number">v{prepared.version}</span>
              <span className="badge badge--brand">
                <IconRocket size={12} />
                Prepared - not published
              </span>
            </div>
            <p className="muted" style={{ fontSize: '0.88rem' }}>
              This version is recorded but not published, so the hub does not announce it as an
              update yet.
            </p>
            <ul className="timeline__notes">
              {prepared.changes.length > 0 ? (
                prepared.changes.map((change) => <li key={change}>{change}</li>)
              ) : (
                <li>Release notes have not been written for this version yet.</li>
              )}
            </ul>
          </div>
        </div>
      ) : null}

      {!prepared && showFutureExample ? (
        <div className="version-example">
          <div className="version-example__head">
            <IconSparkle size={16} />
            <strong>How a future update will appear here</strong>
            <span className="badge">Example only</span>
          </div>
          <p>
            No newer release exists for {app.name}. When version 1.0.1 is published it will appear
            here as <strong>v1.0.1 · Update available</strong>, above the current release, using this
            same layout.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function ReleaseNotes({ notes }) {
  if (!notes || notes.length === 0) {
    return <p className="muted">No release notes have been written yet.</p>
  }

  return (
    <ul className="whatsnew__list">
      {notes.map((note) => (
        <li key={note}>
          <IconNotes size={17} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 3 }} />
          <span>{note}</span>
        </li>
      ))}
    </ul>
  )
}
