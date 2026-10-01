import { getAppBySlug } from '../data/apps'

/**
 * Update service.
 *
 * Phase 1 runs entirely on local data. The public API stays the same so a real
 * backend can be plugged in later without touching any component:
 *
 *   getUpdateStatus(appSlug, installedVersion) -> Promise<UpdateResult>
 *
 * To go live later: set UPDATE_BACKEND.endpoint, flip `mode` to "remote" and
 * make that endpoint return the same payload shape.
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

function buildLocalResult(app, installedVersion) {
  const latest = app.version
  const installed = installedVersion || latest

  if (compareVersions(latest, installed) > 0) {
    return {
      state: UPDATE_STATES.UPDATE_AVAILABLE,
      appSlug: app.slug,
      appName: app.name,
      installedVersion: installed,
      latestVersion: latest,
      publishedAt: app.releasedAt,
      releaseNotes: app.whatsNew,
      downloadUrl: null,
      source: 'local',
    }
  }

  return {
    state: UPDATE_STATES.UP_TO_DATE,
    appSlug: app.slug,
    appName: app.name,
    installedVersion: installed,
    latestVersion: latest,
    publishedAt: app.releasedAt,
    releaseNotes: app.whatsNew,
    downloadUrl: null,
    source: 'local',
  }
}

async function buildRemoteResult(appSlug, installedVersion) {
  const response = await fetch(`${UPDATE_BACKEND.endpoint}?app=${appSlug}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Update check failed with status ${response.status}`)
  }

  return { ...(await response.json()), source: 'remote' }
}

export async function getUpdateStatus(appSlug, installedVersion) {
  if (UPDATE_BACKEND.mode === 'remote' && UPDATE_BACKEND.endpoint) {
    return buildRemoteResult(appSlug, installedVersion)
  }

  const app = getAppBySlug(appSlug)

  if (!app) {
    return {
      state: UPDATE_STATES.UNKNOWN,
      appSlug,
      appName: '',
      installedVersion: installedVersion || '',
      latestVersion: '',
      releaseNotes: [],
      downloadUrl: null,
      source: 'local',
    }
  }

  return buildLocalResult(app, installedVersion)
}
