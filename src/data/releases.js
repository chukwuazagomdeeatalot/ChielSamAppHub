```js
/**
 * Every published release of every app, stored as one flat list.
 *
 * This file holds DATA ONLY. All release logic lives in
 * src/services/releaseService.js.
 */

export const RELEASE_STATUS = {
  CURRENT: 'current',
  SUPERSEDED: 'superseded',
  PREPARED: 'prepared',
  DRAFT: 'draft',
}

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
    status: RELEASE_STATUS.SUPERSEDED,
    channel: RELEASE_CHANNELS.STABLE,
    artifactName: 'ORINZA-v1.0.0.apk',
    artifactUrl: null,
    artifactType: ARTIFACT_TYPES.APK,
    artifactSizeMb: 49.1,
    checksum: '1BEF8B796AA24809E948EA912963EB4746BCD99ABE1997E6EECF091B60C7A9D5',
    buildId: null,
    updateUrl: null,
  },
  {
    appId: 'app_orinza',
    version: '1.1.0',
    versionCode: 2,
    releaseDate: '2026-11-04',
    releaseNotes: 'ORINZA version 1.1.0 release.',
    changes: [
      'ORINZA version 1.1.0.',
      'Updated application release.',
    ],
    minimumSupportedVersion: 'Android 8.0',
    platform: 'Android',
    status: RELEASE_STATUS.CURRENT,
    channel: RELEASE_CHANNELS.STABLE,
    artifactName: 'app-release.apk',
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
```
