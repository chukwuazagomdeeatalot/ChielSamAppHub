import { getAppReleaseMeta } from '../services/releaseService'

export default function DeviceMock({ app }) {
  const release = getAppReleaseMeta(app.id)

  return (
    <div className="device" aria-hidden="true">
      <div className="device__screen">
        <span className="device__notch" />
        <div className="device__head">
          <span
            className="app-icon app-icon--sm"
            style={{
              background: `linear-gradient(140deg, ${app.icon.gradient[0]}, ${app.icon.gradient[1]})`,
              width: 34,
              height: 34,
              fontSize: '0.85rem',
            }}
          >
            {app.icon.initials}
          </span>
          <span>
            <span className="device__store" style={{ display: 'block' }}>
              App Hub
            </span>
            <span className="device__name">{app.name}</span>
          </span>
        </div>

        <div className="device__block">
          <span className="skeleton" style={{ height: 12, width: '85%' }} />
          <span className="skeleton" style={{ height: 12, width: '65%' }} />
        </div>

        <div className="device__row" />
        <div className="device__row" />
        <div className="device__row" />

        <div className="device__cta">
          <span className="device__pill">
            {release.isReleased ? `Download v${release.currentVersion}` : 'Download coming soon'}
          </span>
          <span className="device__pill device__pill--ghost">No new update available</span>
        </div>
      </div>
    </div>
  )
}
