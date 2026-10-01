import { IconInfo, IconRefresh, IconRocket, IconSparkle } from './icons'

/**
 * Preview of the future update flow.
 *
 * This block is ALWAYS an example. It renders a fixed, clearly labelled
 * illustration of what a visitor will see once a real newer release exists
 * with a real download link. It reads no live data and the buttons inside it
 * are disabled, because:
 *
 *   - no update exists right now, and
 *   - the hub does not perform or offer automatic Android updates.
 *
 * When a genuine newer release is published with an artifact url, the real
 * UpdateStatus component and DownloadButton take over automatically.
 */
export default function UpdateFlowPreview({ currentVersion = '1.0.0' }) {
  const exampleLatest = '1.0.1'

  return (
    <div className="update-flow">
      <div className="update-flow__head">
        <IconSparkle size={16} />
        <strong>Future update flow</strong>
        <span className="badge">Example only</span>
      </div>

      <p className="muted" style={{ fontSize: '0.9rem' }}>
        This is a preview of the interface only. It is not a real update and no update is
        available. It shows how the page will behave once a newer version is genuinely published.
      </p>

      <div className="update-flow__demo">
        <div className="update-flow__versions">
          <div>
            <span className="stat-chip__label">Current version</span>
            <strong>v{currentVersion}</strong>
          </div>
          <div className="update-flow__arrow" aria-hidden="true">
            →
          </div>
          <div>
            <span className="stat-chip__label">Latest version</span>
            <strong>v{exampleLatest}</strong>
          </div>
        </div>

        <div className="update-status update-status--available">
          <span className="update-status__icon">
            <IconRocket size={18} />
          </span>
          <span className="update-status__text">
            <span className="update-status__title">UPDATE AVAILABLE</span>
            <span className="update-status__meta">
              Example: current v{currentVersion} · latest v{exampleLatest}
            </span>
          </span>
        </div>

        <div className="update-flow__actions">
          <button type="button" className="btn btn--secondary btn--sm" disabled>
            View Release
          </button>
          <button type="button" className="btn btn--primary btn--sm" disabled>
            <IconRefresh size={15} />
            Update
          </button>
        </div>
      </div>

      <div className="info-note">
        <IconInfo size={18} />
        <span>
          The Update button will never install anything by itself. Automatic in-app updates are not
          implemented; a real update means a visitor downloads a newer build from this page.
        </span>
      </div>
    </div>
  )
}
