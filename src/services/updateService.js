import { getAppBySlug } from '../data/apps'
import {
  compareVersions,
  getAppReleaseMeta,
  getUpdateAvailability,
  isRemoteReleaseSource,
} from './releaseService'

/**
 * Update service.
 *
 * A thin layer over the release service: it answers "does this visitor have
 * the newest version?" and always returns the same shape.
 *
 * UpdateResult contains:
 *   currentVersion, latestVersion, updateAvailable, releaseNotes, updateUrl
 * plus source/isMock so the interface can label local data honestly.
 *
 * This service does NOT perform Android updates and does not download
 * anything. Automatic in-app updates are not implemented - all it does is
 * describe releases that have been recorded as data.
 */

export const UPDATE_STATES = {
  UP_TO_DATE: 'up-to-date',
  UPDATE_AVAILABLE: 'update-available',
  UPDATE_PREPARED: 'update-prepared',
  UNKNOWN: 'unknown',
  ERROR: 'error',
}

export { compareVersions }

/** Synchronous update check, derived from the release records. */
export function getAppUpdate(app, installedVersion) {
  if (!app || !app.slug) {
    return unknownResult(app?.slug || '')
  }

  const availability = getUpdateAvailability(app.id, installedVersion)
  const meta = getAppReleaseMeta(app.id)

  let state = UPDATE_STATES.UP_TO_DATE
  if (availability.updateAvailable) {
    state = UPDATE_STATES.UPDATE_AVAILABLE
  } else if (availability.prepared) {
    state = UPDATE_STATES.UPDATE_PREPARED
  }

  return {
    state,
    appSlug: app.slug,
    appId: app.id,
    appName: app.name,
    currentVersion: availability.installedVersion,
    installedVersion: availability.installedVersion,
    latestVersion: availability.latestVersion,
    updateAvailable: availability.updateAvailable,
    updateReady: availability.updateReady,
    releaseNotes: availability.releaseNotes,
    updateUrl: availability.updateUrl,
    publishedAt: meta.lastUpdated,
    source: isRemoteReleaseSource() ? 'remote' : 'local',
    isMock: !isRemoteReleaseSource(),
  }
}

function unknownResult(slug) {
  return {
    state: UPDATE_STATES.UNKNOWN,
    appSlug: slug,
    appId: '',
    appName: '',
    currentVersion: null,
    installedVersion: null,
    latestVersion: null,
    updateAvailable: false,
    updateReady: false,
    releaseNotes: [],
    updateUrl: null,
    publishedAt: null,
    source: 'local',
    isMock: true,
  }
}

/** Async wrapper kept for compatibility with the existing hook. */
export async function getUpdateStatus(appSlug, installedVersion) {
  const app = getAppBySlug(appSlug)
  return getAppUpdate(app, installedVersion)
}
