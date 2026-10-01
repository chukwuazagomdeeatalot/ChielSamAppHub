export default function DeviceMock({ app }) {
  return (
    <div className="device" aria-hidden="true">
      <div className="device__screen">
        <span className="device__notch" />
        <div className="device__head">
          <span
            className="app-icon app-icon--sm"
            style={{
              background: `linear-gradient(140deg, ${app.gradient[0]}, ${app.gradient[1]})`,
              width: 34,
              height: 34,
              fontSize: '0.85rem',
            }}
          >
            {app.initials}
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
          <span className="device__pill">Download v{app.version}</span>
          <span className="device__pill device__pill--ghost">No new update available</span>
        </div>
      </div>
    </div>
  )
}
