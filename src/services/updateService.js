import { getAppBySlug, getPendingUpdate } from '../data/apps'

/**
 * Update service.
 *
 * Phase 4 still runs on local data - there is no backend. The public API is
 * kept stable so a real service can replace it later without changing any
 * component:
 *
 *   getUpdateStatus(appSlug, installedVersion) -> Promise<UpdateResult>
 *   getAppUpdate(app, installedVersion)        -> UpdateResult
 *
 * UpdateResult always contains:
 *   currentVersion, latestVersion, updateAvailable, releaseNotes, updateUrl
 *
 * `source` tells the UI where the answer came from, so the interface can label
 * mocked data honestly: "local" today, "remote" once a real endpoint is added.
 *
 * To go live later: set UPDATE_BACKEND.mode = "remote" and fill in
 * UPDATE_BACKEND.endpoint. The endpoint only has to return the same fields.
 */

export const UPDATE_BACKEND = {
  mode: 'local',
  endpoint: null,
}

export const UPDATE_STATES = {
  UP_TO_DATE: 'up-to-date',
  UPDATE_AVAILABLE: 'update-available',
  UNKNOWN: 'unknown',
  ERROR: 'error',
}

function toVersionParts(version) {
  return String(version)
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0)
}

export function compareVersions(a, b) {
  const left = toVersionParts(a)
  const right = toVersionParts(b)
  const length = Math.max(left.length, right.length)

  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0)
    if (difference !== 0) return difference > 0 ? 1 : -1
  }

  return 0
}

export function isRemoteSource() {
  return UPDATE_BACKEND.mode === 'remote' && Boolean(UPDATE_BACKEND.endpoint)
}

/**
 * Builds the update result for one app. Works with local data today and is the
 * single place that decides whether an update exists.
 */
export function getAppUpdate(app, installedVersion) {
  if (!app || !app.version) {
    return {
      state: UPDATE_STATES.UNKNOWN,
      appSlug: app?.slug || '',
      appId: app?.id || '',
      appName: app?.name || '',
      currentVersion: null,
      installedVersion: installedVersion || null,
      latestVersion: null,
      updateAvailable: false,
      releaseNotes: [],
      updateUrl: null,
      publishedAt: null,
      source: isRemoteSource() ? 'remote' : 'local',
      isMock: !isRemoteSource(),
    }
  }

  const pending = getPendingUpdate(app)
  const installed = installedVersion || app.version
  const latestVersion = pending?.latestVersion || app.version
  const updateAvailable = compareVersions(latestVersion, installed) > 0

  return {
    state: updateAvailable ? UPDATE_STATES.UPDATE_AVAILABLE : UPDATE_STATES.UP_TO_DATE,
    appSlug: app.slug,
    appId: app.id,
    appName: app.name,
    currentVersion: app.version,
    installedVersion: installed,
    latestVersion,
    updateAvailable,
    releaseNotes: pending?.releaseNotes || app.whatsNew,
    updateUrl: pending?.updateUrl || null,
    publishedAt: app.updatedAt,
    source: isRemoteSource() ? 'remote' : 'local',
    isMock: !isRemoteSource(),
  }
}

async function fetchRemoteUpdate(app, installedVersion) {
  const response = await fetch(
    `${UPDATE_BACKEND.endpoint}?app=${app.slug}&installed=${installedVersion || app.version}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    throw new Error(`Update check failed with status ${response.status}`)
  }

  const payload = await response.json()

  return {
    ...getAppUpdate(app, installedVersion),
    ...payload,
    state: payload.updateAvailable ? UPDATE_STATES.UPDATE_AVAILABLE : UPDATE_STATES.UP_TO_DATE,
    source: 'remote',
    isMock: false,
  }
}

export async function getUpdateStatus(appSlug, installedVersion) {
  const app = getAppBySlug(appSlug)

  if (!app) {
    return {
      state: UPDATE_STATES.UNKNOWN,
      appSlug,
      appId: '',
      appName: '',
      currentVersion: null,
      installedVersion: installedVersion || null,
      latestVersion: null,
      updateAvailable: false,
      releaseNotes: [],
      updateUrl: null,
      publishedAt: null,
      source: isRemoteSource() ? 'remote' : 'local',
      isMock: true,
    }
  }

  if (isRemoteSource()) {
    return fetchRemoteUpdate(app, installedVersion)
  }

  return getAppUpdate(app, installedVersion)
}
