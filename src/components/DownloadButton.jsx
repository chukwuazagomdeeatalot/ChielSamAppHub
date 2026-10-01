import { DOWNLOAD_STATES, isReleased } from '../data/apps'
import { IconClock, IconDownload, IconLock, IconRefresh } from './icons'

/**
 * One download button for the whole hub.
 *
 * States:
 *   available          real download link exists
 *   coming-soon        app exists, no file hosted yet (ORINZA today)
 *   update-available   a newer version exists and its link is live
 *   update-coming-soon a newer version exists but cannot be downloaded yet
 *
 * A link is only rendered when a real url exists, so the button can never
 * point somewhere invented.
 */
export default function DownloadButton({ app, update, size = 'lg', block = true }) {
  const latestVersion = update?.latestVersion || null
  const hasUpdate = Boolean(update?.updateAvailable)
  const pendingUpdateAvailable = hasUpdate && Boolean(update?.updateUrl)
  const downloadAvailable =
    app.download.state === DOWNLOAD_STATES.AVAILABLE && Boolean(app.download.url)

  let state = app.download.state
  if (hasUpdate) {
    state = pendingUpdateAvailable
      ? DOWNLOAD_STATES.UPDATE_AVAILABLE
      : DOWNLOAD_STATES.UPDATE_COMING_SOON
  }

  const configs = {
    [DOWNLOAD_STATES.AVAILABLE]: {
      label: `Download ${isReleased(app) ? `v${app.version}` : ''}`.trim(),
      hint: app.download.note,
      href: app.download.url,
      disabled: !downloadAvailable,
      icon: IconDownload,
    },
    [DOWNLOAD_STATES.COMING_SOON]: {
      label: 'Download coming soon',
      hint: app.download.note,
      href: null,
      disabled: true,
      icon: IconClock,
    },
    [DOWNLOAD_STATES.UPDATE_AVAILABLE]: {
      label: `Update to v${latestVersion}`,
      hint: 'The update is ready to download.',
      href: update?.updateUrl || null,
      disabled: !pendingUpdateAvailable,
      icon: IconRefresh,
    },
    [DOWNLOAD_STATES.UPDATE_COMING_SOON]: {
      label: 'Update coming soon',
      hint: latestVersion
        ? `Version ${latestVersion} is prepared but not downloadable yet.`
        : 'An update is being prepared.',
      href: null,
      disabled: true,
      icon: IconLock,
    },
  }

  const config = configs[state]
  const ButtonIcon = config.icon
  const className = `btn btn--primary${size === 'lg' ? ' btn--lg' : ''}${block ? ' btn--block' : ''}`

  const content = (
    <>
      <ButtonIcon size={18} />
      {config.label}
    </>
  )

  return (
    <div className="download-state">
      {config.href ? (
        <a className={className} href={config.href} download={app.download.fileName || undefined}>
          {content}
        </a>
      ) : (
        <button type="button" className={className} disabled>
          {content}
        </button>
      )}
      <p className="download-state__hint">{config.hint}</p>
    </div>
  )
}
