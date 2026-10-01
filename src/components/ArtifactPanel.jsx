import { ARTIFACT_TYPES, ARTIFACT_TYPE_LABELS } from '../data/releases'
import { getArtifactAvailability, getReleasesForApp } from '../services/releaseService'
import { IconLock, IconPackage } from './icons'

/**
 * Build artifact panel.
 *
 * Shows which artifact formats the hub is designed to carry, and the real
 * state of each one for this app. No file is ever invented: a format is only
 * marked "Available" when that release actually passes every download check.
 */
export default function ArtifactPanel({ app }) {
  const releases = getReleasesForApp(app.id)
  const current = releases.find((release) => release.status === 'current') || releases[0] || null
  const availability = getArtifactAvailability(current)

  const formats = Object.values(ARTIFACT_TYPES)

  function stateFor(type) {
    const match = releases.find((release) => release.artifactType === type)

    if (!match) {
      return { tone: 'default', label: 'Not built', file: null }
    }

    const artifact = getArtifactAvailability(match)

    if (artifact.downloadable) {
      return { tone: 'success', label: 'Available', file: artifact.fileName }
    }

    return { tone: 'warning', label: 'Not hosted', file: null }
  }

  return (
    <div className="artifacts">
      <div className="artifacts__grid">
        {formats.map((type) => {
          const state = stateFor(type)

          return (
            <div className="artifact" key={type}>
              <span className="artifact__icon">
                <IconPackage size={17} />
              </span>
              <div className="artifact__body">
                <span className="artifact__type">{ARTIFACT_TYPE_LABELS[type]}</span>
                <span className={`badge badge--${state.tone}`}>{state.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="artifacts__current">
        <span className="footer__title">Artifact for the current release</span>
        {current ? (
          <dl className="spec-table" style={{ marginTop: 12 }}>
            <dt>Version</dt>
            <dd>v{current.version}</dd>
            <dt>Version code</dt>
            <dd>{current.versionCode ?? '—'}</dd>
            <dt>Expected format</dt>
            <dd>{ARTIFACT_TYPE_LABELS[current.artifactType] || 'Not set'}</dd>
            <dt>Expected file name</dt>
            <dd>{availability.expectedFileName || 'Not determined'}</dd>
            <dt>Uploaded file</dt>
            <dd>{availability.fileName || 'No file uploaded'}</dd>
            <dt>File size</dt>
            <dd>{availability.sizeLabel || 'Not recorded'}</dd>
            <dt>Checksum</dt>
            <dd>{current.checksum || 'Not available'}</dd>
            <dt>Build ID</dt>
            <dd>{current.buildId || 'Not available'}</dd>
          </dl>
        ) : (
          <p className="muted" style={{ marginTop: 10 }}>
            {app.name} has no release yet, so there is no artifact.
          </p>
        )}
      </div>

      <div className="info-note">
        <IconLock size={18} />
        <span>
          APKs are delivered from GitHub Releases, never stored in this repository. A format is
          marked &ldquo;Available&rdquo; only once a real file has been published and its URL is
          configured in <code>src/data/distribution.js</code>.
        </span>
      </div>
    </div>
  )
}
