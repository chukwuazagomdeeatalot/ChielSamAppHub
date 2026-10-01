/**
 * Every published release of every app, stored as one flat list.
 *
 * This file holds DATA ONLY. All release logic (version comparison, current vs
 * latest, status labels) lives in `src/services/releaseService.js`.
 *
 * Rules for this file:
 *  1. Only add a release that genuinely happened. Never invent history.
 *  2. `artifactUrl` and `checksum` must stay null until a real file exists.
 *     A null url means "no file hosted", not "link coming soon" - the UI shows
 *     the difference and never fabricates a link.
 *  3. Exactly one release per app may have status CURRENT. That is the version
 *     the hub presents as the app's current version.
 *  4. `versionCode` is the Android version code, which must increase for every
 *     upload the Play Store / Android installer will accept as an update.
 *
 * A release can hold several real versions (v1.0.0, v1.1.0, v2.0.0, ...). Each
 * one is an independent record; the newest published record is the current
 * release and every older record stays visible in the app's release history.
 *
 * Where the APK binary actually lives is configured separately, in
 * `src/data/distribution.js`.
 */

export const RELEASE_STATUS = {
  CURRENT: 'current',
  SUPERSEDED: 'superseded',
  PREPARED: 'prepared',
  DRAFT: 'draft',
}

/**
 * Build artifact formats the hub is designed to carry. Declaring the format
 * list up front means a real APK, AAB, desktop or iOS build can be attached
 * later without changing the data model.
 */
export const ARTIFACT_TYPES = {
  APK: 'apk',
  AAB: 'aab',
  WEB: 'web',
  WINDOWS: 'windows',
  IOS: 'ios',
  MACOS: 'macos',
}

export const ARTIFACT_TYPE_LABELS = {
  [ARTIFACT_TYPES.APK]: 'APK',
  [ARTIFACT_TYPES.AAB]: 'AAB',
  [ARTIFACT_TYPES.WEB]: 'Web build',
  [ARTIFACT_TYPES.WINDOWS]: 'Windows build',
  [ARTIFACT_TYPES.IOS]: 'iOS build',
  [ARTIFACT_TYPES.MACOS]: 'macOS build',
}

export const RELEASE_CHANNELS = {
  STABLE: 'Stable',
  BETA: 'Beta',
}

export const RELEASES = [
  {
    appId: 'app_orinza',
    version: '1.0.0',
    versionCode: 1,
    releaseDate: '2026-09-28',
    releaseNotes: 'First public release of ORINZA.',
    changes: [
      'First public release of ORINZA.',
      'Core entertainment experience and navigation.',
      'Prepared for future feature updates through CHIELSAM APP HUB.',
    ],
    minimumSupportedVersion: 'Android 8.0',
    platform: 'Android',
    status: RELEASE_STATUS.CURRENT,
    channel: RELEASE_CHANNELS.STABLE,
    artifactName: null,
    artifactUrl: null,
    artifactType: ARTIFACT_TYPES.APK,
    artifactSizeMb: null,
    checksum: null,
    buildId: null,
    updateUrl: null,
  },
]

export function getAllReleaseRecords() {
  return RELEASES
}
