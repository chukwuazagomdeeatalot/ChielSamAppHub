import { APP_STATUS, getAllApps, getAppById } from '../data/apps'
import {
  ARTIFACT_TYPE_LABELS,
  RELEASE_STATUS,
  getAllReleaseRecords,
} from '../data/releases'

/**
 * Release service.
 *
 * All release logic lives here: which release is current, which is latest,
 * how to compare versions, and what status to show. Components read these
 * functions and never touch the raw release list.
 *
 * The data is currently LOCAL (a file in this project) and clearly flagged as
 * such - every result carries `source` and `isMock`. To move to a real
 * service later, set RELEASE_BACKEND.mode = 'remote' and fill in
 * RELEASE_BACKEND.endpoint. The endpoint only has to return the same release
 * fields; no component changes.
 *
 * Nothing here performs Android updates, downloads files or talks to a build
 * system. It only describes releases that have been recorded as data.
 */

export const RELEASE_BACKEND = {
  mode: 'local',
  endpoint: null,
}

export const RELEASE_STATUS_LABELS = {
  [RELEASE_STATUS.CURRENT]: 'Current',
  [RELEASE_STATUS.SUPERSEDED]: 'Superseded',
  [RELEASE_STATUS.PREPARED]: 'Prepared',
  [RELEASE_STATUS.DRAFT]: 'Draft',
}

export const RELEASE_STATUS_TONES = {
  [RELEASE_STATUS.CURRENT]: 'success',
  [RELEASE_STATUS.SUPERSEDED]: 'default',
  [RELEASE_STATUS.PREPARED]: 'brand',
  [RELEASE_STATUS.DRAFT]: 'warning',
}

/** A release counts as published once it is current or has been superseded. */
const PUBLISHED_STATUSES = [RELEASE_STATUS.CURRENT, RELEASE_STATUS.SUPERSEDED]

export function isRemoteReleaseSource() {
  return RELEASE_BACKEND.mode === 'remote' && Boolean(RELEASE_BACKEND.endpoint)
}

function withSource(release) {
  return { ...release, source: isRemoteReleaseSource() ? 'remote' : 'local', isMock: !isRemoteReleaseSource() }
}

function toVersionParts(version) {
  return String(version)
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0)
}

/**
 * Semantic version comparison.
 *   compareVersions('1.0.1', '1.0.0')  ->  1
 *   compareVersions('1.0.0', '1.0.0')  ->  0
 *   compareVersions('1.0.0', '1.0.1')  -> -1
 */
export function compareVersions(a, b) {
  if (!a || !b) return 0

  const left = toVersionParts(a)
  const right = toVersionParts(b)
  const length = Math.max(left.length, right.length)

  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0)
    if (difference !== 0) return difference > 0 ? 1 : -1
  }

  return 0
}

export function compareSemver(a, b) {
  return compareVersions(a, b)
}

function byVersionDescending(a, b) {
  return compareVersions(b.version, a.version)
}

/** All releases for one app, newest version first. */
export function getReleasesForApp(appId) {
  return getAllReleaseRecords()
    .filter((release) => release.appId === appId)
    .sort(byVersionDescending)
    .map(withSource)
}

/** Published releases only (current + superseded), newest first. */
export function getPublishedReleasesForApp(appId) {
  return getReleasesForApp(appId).filter((release) => PUBLISHED_STATUSES.includes(release.status))
}

/** The newest published release for an app. */
export function getLatestRelease(appId) {
  return getPublishedReleasesForApp(appId)[0] || null
}

/** The single release the hub presents as the app's current version. */
export function getCurrentRelease(appId) {
  return getPublishedReleasesForApp(appId).find((release) => release.status === RELEASE_STATUS.CURRENT) || null
}

/**
 * A prepared/draft release newer than the current one. This is what makes the
 * site show "Update coming soon" instead of "Update available" - an update is
 * never announced until a real, published release exists.
 */
export function getPreparedRelease(appId) {
  const current = getCurrentRelease(appId)

  return (
    getReleasesForApp(appId)
      .filter(
        (release) =>
          [RELEASE_STATUS.PREPARED, RELEASE_STATUS.DRAFT].includes(release.status) &&
          (!current || compareVersions(release.version, current.version) > 0),
      )
      .sort(byVersionDescending)[0] || null
  )
}

/**
 * Normalised status for one release, ready for display.
 * `hasArtifact` is false until a real artifactUrl exists, which is what stops
 * the UI from ever offering a download that is not there.
 */
export function getReleaseStatus(release) {
  if (!release) {
    return {
      status: null,
      label: 'No release',
      tone: 'default',
      isCurrent: false,
      isPublished: false,
      hasArtifact: false,
    }
  }

  return {
    status: release.status,
    label: RELEASE_STATUS_LABELS[release.status] || 'Unknown',
    tone: RELEASE_STATUS_TONES[release.status] || 'default',
    isCurrent: release.status === RELEASE_STATUS.CURRENT,
    isPublished: PUBLISHED_STATUSES.includes(release.status),
    hasArtifact: Boolean(release.artifactUrl),
    artifactTypeLabel: ARTIFACT_TYPE_LABELS[release.artifactType] || null,
  }
}

/** Release info for the app's own page: current version, date and notes. */
export function getAppReleaseMeta(appId) {
  const app = getAppById(appId)
  const current = getCurrentRelease(appId)
  const latest = getLatestRelease(appId)
  const prepared = getPreparedRelease(appId)

  return {
    appId,
    appName: app?.name || '',
    isReleased: current !== null,
    currentVersion: current?.version || null,
    currentRelease: current,
    latestVersion: latest?.version || null,
    latestRelease: latest,
    preparedRelease: prepared,
    releaseDate: current?.releaseDate || null,
    lastUpdated: latest?.releaseDate || null,
    whatsNew: current?.changes || [],
    releaseNotes: current?.releaseNotes || null,
    minimumSupportedVersion: current?.minimumSupportedVersion || app?.platformDetails?.minimum || null,
    releaseStatus: getReleaseStatus(current),
    releaseCount: getReleasesForApp(appId).length,
    hasUpdate: prepared !== null,
  }
}

export function isReleased(app) {
  return getCurrentRelease(app?.id) !== null
}

export function getDisplayVersion(app) {
  const version = getCurrentRelease(app?.id)?.version
  return version ? `v${version}` : 'Not released'
}

export function getPlatformLabel(app) {
  const version = getCurrentRelease(app?.id)?.version
  return version ? `${app.platform} · v${version}` : `${app.platform} · unreleased`
}

/**
 * Update state shown to a visitor. `installedVersion` is what the visitor
 * already has; when it is not known the latest published release is assumed, so
 * the hub never claims an update that does not exist.
 */
export function getUpdateAvailability(appId, installedVersion) {
  const meta = getAppReleaseMeta(appId)
  const target = installedVersion || meta.currentVersion

  if (!meta.currentVersion) {
    return {
      appId,
      updateAvailable: false,
      updateReady: false,
      installedVersion: target || null,
      latestVersion: null,
      updateUrl: null,
      releaseNotes: [],
      reason: 'no-release',
    }
  }

  const latest = meta.latestRelease
  const updateAvailable = compareVersions(latest.version, target) > 0
  const prepared = meta.preparedRelease

  if (updateAvailable) {
    return {
      appId,
      updateAvailable: true,
      updateReady: Boolean(latest.artifactUrl),
      installedVersion: target,
      latestVersion: latest.version,
      updateUrl: latest.artifactUrl,
      releaseNotes: latest.changes,
      reason: 'published-release-available',
    }
  }

  if (prepared) {
    return {
      appId,
      updateAvailable: false,
      updateReady: false,
      prepared: true,
      installedVersion: target,
      latestVersion: meta.currentVersion,
      updateUrl: null,
      releaseNotes: prepared.changes,
      reason: 'prepared-not-published',
    }
  }

  return {
    appId,
    updateAvailable: false,
    updateReady: false,
    installedVersion: target,
    latestVersion: meta.currentVersion,
    updateUrl: null,
    releaseNotes: meta.whatsNew,
    reason: 'up-to-date',
  }
}

/** Every release of every app, newest first, with its app attached. */
export function getAllReleases() {
  return getAllReleaseRecords()
    .map((release) => {
      const app = getAppById(release.appId)

      return {
        ...release,
        appId: release.appId,
        appName: app?.name || '',
        appSlug: app?.slug || '',
        appIcon: app?.icon || null,
        appCategory: app?.category || '',
        isCurrent: release.status === RELEASE_STATUS.CURRENT,
      }
    })
    .sort((a, b) => {
      if (a.releaseDate !== b.releaseDate) {
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      }
      return byVersionDescending(a, b)
    })
}

export function getAppsWithPreparedUpdates() {
  return getAllApps().filter((app) => getPreparedRelease(app.id) !== null)
}

export function getHubStats() {
  const apps = getAllApps()
  const releases = getAllReleases()
  const latest = releases[0] || null

  return {
    totalApps: apps.length,
    available: apps.filter((app) => app.status === APP_STATUS.AVAILABLE).length,
    comingSoon: apps.filter((app) => app.status === APP_STATUS.COMING_SOON).length,
    categories: new Set(apps.map((app) => app.category)).size,
    releases: releases.length,
    currentReleases: releases.filter((release) => release.isCurrent).length,
    latestVersion: latest?.version || null,
    latestReleaseApp: latest?.appName || null,
    appsWithUpdates: getAppsWithPreparedUpdates().length,
  }
}
