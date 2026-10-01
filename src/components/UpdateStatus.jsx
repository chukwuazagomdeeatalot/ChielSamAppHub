import useUpdateStatus from '../hooks/useUpdateStatus'
import {
  IconCheckCircle,
  IconDownload,
  IconInfo,
  IconRefresh,
  IconClock,
} from './icons'

const TONE_BY_STATE = {
  'up-to-date': 'update-status--up-to-date',
  'update-available': 'update-status--available',
}

/**
 * Future-ready update indicator.
 * It only consumes the payload from `services/updateService`, so wiring a real
 * backend later requires no change here.
 */
export default function UpdateStatus({ app, installedVersion, compact = false }) {
  const { loading, error, data, refresh } = useUpdateStatus(app, installedVersion)

  if (loading) {
    return (
      <div className="update-status update-status--loading" role="status">
        <span className="update-status__icon">
          <span className="spinner" />
        </span>
        <span className="update-status__text">
          <span className="update-status__title">Checking for updates…</span>
          {!compact ? <span className="update-status__meta">Contacting the update service</span> : null}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="update-status update-status--error" role="status">
        <span className="update-status__icon">
          <IconInfo size={18} />
        </span>
        <span className="update-status__text">
          <span className="update-status__title">Update status unavailable</span>
          <span className="update-status__meta">Please try again later</span>
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={refresh}>
          <IconRefresh size={15} />
          Retry
        </button>
      </div>
    )
  }

  const hasUpdate = data?.state === 'update-available'

  return (
    <div
      className={`update-status ${TONE_BY_STATE[data?.state] || ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="update-status__icon">
        {hasUpdate ? <IconDownload size={18} /> : <IconCheckCircle size={18} />}
      </span>

      <span className="update-status__text">
        <span className="update-status__title">
          {hasUpdate ? `Update available — v${data.latestVersion}` : 'No new update available'}
        </span>
        {!compact ? (
          <span className="update-status__meta">
            {hasUpdate
              ? `You have v${data.installedVersion} · released ${data.publishedAt}`
              : `Latest version v${data.latestVersion} · released ${data.publishedAt}`}
          </span>
        ) : null}
      </span>

      <button type="button" className="btn btn--ghost btn--sm" onClick={refresh}>
        <IconRefresh size={15} />
        Check
      </button>
    </div>
  )
}

export function UpdateStatusCompact({ app, installedVersion }) {
  const { loading, data } = useUpdateStatus(app, installedVersion)

  if (loading) {
    return (
      <div className="update-status update-status--loading" style={{ padding: '10px 14px' }}>
        <span className="update-status__icon" style={{ width: 26, height: 26 }}>
          <span className="spinner" style={{ width: 13, height: 13 }} />
        </span>
        <span className="update-status__text">
          <span className="update-status__title">Checking…</span>
        </span>
      </div>
    )
  }

  const hasUpdate = data?.state === 'update-available'

  return (
    <div
      className={`update-status ${TONE_BY_STATE[data?.state] || ''}`}
      style={{ padding: '10px 14px', fontSize: '0.82rem' }}
    >
      <span className="update-status__icon" style={{ width: 26, height: 26 }}>
        {hasUpdate ? <IconDownload size={15} /> : <IconCheckCircle size={15} />}
      </span>
      <span className="update-status__text">
        <span className="update-status__title">
          {hasUpdate ? 'Update available' : 'No new update available'}
        </span>
      </span>
      <span className="update-status__icon" style={{ background: 'transparent', width: 20 }}>
        <IconClock size={14} />
      </span>
    </div>
  )
}
