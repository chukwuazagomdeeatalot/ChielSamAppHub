import { getPendingUpdate, isReleased } from '../data/apps'
import { IconCheck, IconInfo, IconNotes, IconRocket, IconSparkle } from './icons'

/**
 * Version history for one app.
 *
 * Only genuine releases from the app data are listed. The dashed block is
 * clearly marked as an example of how a future update entry will look, so no
 * fake version is ever presented as real history.
 */
export default function VersionHistory({ app, showFutureExample = true }) {
  const releases = app.releases
  const pending = getPendingUpdate(app)

  if (!isReleased(app) && releases.length === 0) {
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
      {releases.map((release, index) => (
        <div className="version-entry" key={release.version}>
          <div className="version-entry__rail">
            <span className={`version-entry__dot${release.isCurrent ? ' is-current' : ''}`} />
            {index < releases.length - 1 ? <span className="version-entry__line" /> : null}
          </div>

          <div className="version-entry__card">
            <div className="version-entry__head">
              <span className="version-entry__number">v{release.version}</span>
              {release.isCurrent ? (
                <span className="badge badge--success">
                  <IconCheck size={12} />
                  Current release
                </span>
              ) : (
                <span className="badge">Earlier release</span>
              )}
              <span className="timeline__date" style={{ marginLeft: 'auto' }}>
                {release.date}
              </span>
            </div>

            <span className="version-entry__type">{release.type}</span>

            <ul className="timeline__notes">
              {release.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {pending ? (
        <div className="version-entry">
          <div className="version-entry__rail">
            <span className="version-entry__dot is-pending" />
          </div>
          <div className="version-entry__card version-entry__card--pending">
            <div className="version-entry__head">
              <span className="version-entry__number">v{pending.latestVersion}</span>
              <span className="badge badge--brand">
                <IconRocket size={12} />
                Update available
              </span>
            </div>
            <span className="version-entry__type">Prepared for release</span>
            <ul className="timeline__notes">
              {pending.releaseNotes.length > 0 ? (
                pending.releaseNotes.map((note) => <li key={note}>{note}</li>)
              ) : (
                <li>Release notes have not been written for this version yet.</li>
              )}
            </ul>
          </div>
        </div>
      ) : null}

      {!pending && showFutureExample ? (
        <div className="version-example">
          <div className="version-example__head">
            <IconSparkle size={16} />
            <strong>How a future update will appear here</strong>
            <span className="badge">Example only</span>
          </div>
          <p>
            No update is pending for {app.name}. When version 1.1.0 is published, this page will show
            it as <strong>v1.1.0 · Update available</strong> above the current release, using the
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
          <IconNotes
            size={17}
            style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 3 }}
          />
          <span>{note}</span>
        </li>
      ))}
    </ul>
  )
}
