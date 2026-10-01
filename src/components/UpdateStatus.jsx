import useUpdateStatus from '../hooks/useUpdateStatus'
import { IconCheckCircle, IconDownload, IconInfo, IconRefresh, IconClock } from './icons'

const TONE_BY_STATE = {
  'up-to-date': 'update-status--up-to-date',
  'update-available': 'update-status--available',
}

function Icon({ loading, hasUpdate }) {
  if (loading) return <span className="spinner" />
  return hasUpdate ? <IconDownload size={18} /> : <IconCheckCircle size={18} />
}

function StatusBody({ loading, error, data, compact }) {
  if (loading) {
    return (
      <span className="update-status__text">
        <span className="update-status__title">Checking for updates…</span>
        {!compact ? <span className="update-status__meta">Reading local release data</span> : null}
      </span>
    )
  }

  if (error) {
    return (
      <span className="update-status__text">
        <span className="update-status__title">Update status unavailable</span>
        <span className="update-status__meta">Please try again later</span>
      </span>
    )
  }

  const hasUpdate = data?.updateAvailable

  return (
    <span className="update-status__text">
      <span className="update-status__title">
        {hasUpdate ? `Update available — v${data.latestVersion}` : 'No new update available'}
      </span>
      {!compact ? (
        <span className="update-status__meta">
          {hasUpdate
            ? `Current v${data.currentVersion} · latest v${data.latestVersion}`
            : `Latest version v${data.latestVersion} · released ${data.publishedAt}`}
        </span>
      ) : null}
    </span>
  )
}

/**
 * Future-ready update indicator.
 *
 * It only reads the payload from `services/updateService`, so pointing it at a
 * real backend later requires no change here. While the data is local, the
 * component labels itself so the mock source is never hidden.
 */
export default function UpdateStatus({ app, installedVersion, compact = false }) {
  const { loading, error, data, refresh } = useUpdateStatus(app, installedVersion)
  const hasUpdate = Boolean(data?.updateAvailable)
  const isMock = data?.isMock !== false && data?.state !== 'unknown'

  return (
    <div
      className={`update-status ${
        loading ? 'update-status--loading' : ''
      } ${error ? 'update-status--error' : ''} ${TONE_BY_STATE[data?.state] || ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="update-status__icon">
        <Icon loading={loading} hasUpdate={hasUpdate} />
      </span>

      <StatusBody loading={loading} error={error} data={data} compact={compact} />

      {isMock && !loading && !error ? (
        <span className="update-status__source" title="No backend yet - read from local app data">
          Local data
        </span>
      ) : null}

      <button type="button" className="btn btn--ghost btn--sm" onClick={refresh}>
        <IconRefresh size={15} />
        Check
      </button>
    </div>
  )
}

export function UpdateStatusCompact({ app, installedVersion }) {
  const { loading, data } = useUpdateStatus(app, installedVersion)
  const hasUpdate = Boolean(data?.updateAvailable)

  return (
    <div
      className={`update-status ${loading ? 'update-status--loading' : ''} ${
        TONE_BY_STATE[data?.state] || ''
      }`}
      style={{ padding: '10px 14px', fontSize: '0.82rem' }}
    >
      <span className="update-status__icon" style={{ width: 26, height: 26 }}>
        <Icon loading={loading} hasUpdate={hasUpdate} />
      </span>
      <span className="update-status__text">
        <span className="update-status__title">
          {loading ? 'Checking…' : hasUpdate ? 'Update available' : 'No new update available'}
        </span>
      </span>
      <span className="update-status__icon" style={{ background: 'transparent', width: 20 }}>
        <IconClock size={14} />
      </span>
    </div>
  )
}
