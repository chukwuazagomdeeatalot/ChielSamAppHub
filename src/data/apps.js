export const APP_CATEGORIES = [
  'All',
  'Entertainment',
  'Productivity',
  'Utilities',
  'Games',
  'Education',
]

export const APP_STATUS = {
  AVAILABLE: 'Available',
  COMING_SOON: 'Coming Soon',
  IN_REVIEW: 'In Review',
}

export const DOWNLOAD_STATES = {
  AVAILABLE: 'available',
  COMING_SOON: 'coming-soon',
  UPDATE_AVAILABLE: 'update-available',
  UPDATE_COMING_SOON: 'update-coming-soon',
}

/**
 * Every app on the hub is one object in this list.
 *
 * To publish a new app: copy the ORINZA object, give it a new `id` and `slug`,
 * and it appears automatically on the Apps page, the Home featured/updates
 * areas, its own details route and the dashboard. No other file is edited.
 *
 * `version` is null until the app has a real published release. A release is
 * only listed in `releases` if it genuinely happened - never add placeholder
 * versions to the history.
 */
export const APPS = [
  {
    id: 'app_orinza',
    name: 'ORINZA',
    slug: 'orinza',
    tagline: 'Entertainment, without the noise.',
    category: 'Entertainment',
    status: APP_STATUS.AVAILABLE,
    publisher: 'ChielSam',

    icon: {
      type: 'generated',
      initials: 'O',
      gradient: ['#7c3aed', '#2563eb'],
      alt: 'ORINZA app icon',
    },

    platform: 'Android',
    platformDetails: {
      minimum: 'Android 8.0+',
      architectures: 'Universal',
      requirements: 'Internet not required for core features',
    },

    version: '1.0.0',

    shortDescription:
      'A fresh entertainment experience built for quick, distraction-free fun on your phone.',
    description:
      'ORINZA is the first app published on CHIELSAM APP HUB. It is built as a lightweight, fast entertainment companion that keeps everything a few taps away, so you can get to the good part without digging through menus. Version 1.0.0 is the first public release, and every future improvement will be tracked here on the hub with a clear version number, release date and change list.',

    features: [
      'Fast launch with a lightweight interface',
      'Core entertainment experience in one place',
      'No account needed to use the app',
      'Built to grow - new features arrive through hub updates',
    ],

    screenshots: [
      { label: 'Home', glyph: 'home', image: null },
      { label: 'Discover', glyph: 'compass', image: null },
      { label: 'Library', glyph: 'layers', image: null },
      { label: 'Settings', glyph: 'settings', image: null },
    ],

    whatsNew: [
      'First public release of ORINZA.',
      'Core entertainment experience and navigation.',
      'Prepared for future feature updates through CHIELSAM APP HUB.',
    ],

    download: {
      state: DOWNLOAD_STATES.COMING_SOON,
      url: null,
      fileName: null,
      sizeMb: null,
      note: 'No APK is hosted yet. The download link will appear here once hosting is connected.',
    },

    update: {
      latestVersion: null,
      updateUrl: null,
      releaseNotes: [],
      channel: 'Stable',
      releaseChannel: 'Public',
      autoUpdate: false,
      support: 'Updates are published manually by ChielSam.',
      checkEndpoint: null,
    },

    releases: [
      {
        version: '1.0.0',
        date: '2026-09-28',
        type: 'Initial release',
        notes: [
          'First public release of ORINZA.',
          'Core entertainment experience and navigation.',
          'Prepared for future feature updates through CHIELSAM APP HUB.',
        ],
        isCurrent: true,
      },
    ],

    featured: true,
    releasedAt: '2026-09-28',
    updatedAt: '2026-09-28',
    rating: 'New',
    downloads: '—',
  },

  {
    id: 'app_placeholder_next',
    name: 'NEXT APP',
    slug: 'next-app',
    tagline: 'A reserved slot for the next ChielSam app.',
    category: 'Productivity',
    status: APP_STATUS.COMING_SOON,
    publisher: 'ChielSam',

    icon: {
      type: 'generated',
      initials: 'N',
      gradient: ['#0ea5e9', '#14b8a6'],
      alt: 'Placeholder app icon',
    },

    platform: 'Android',
    platformDetails: {
      minimum: 'To be confirmed',
      architectures: 'To be confirmed',
      requirements: 'To be confirmed',
    },

    version: null,

    shortDescription:
      'Placeholder entry showing how a second app appears in the catalogue automatically.',
    description:
      'This is a template entry, not a published app. It exists to demonstrate that CHIELSAM APP HUB scales to many apps: the catalogue page, the dashboard, the release list and the details route all read from the same data source. Replace this object with real app details, or delete it entirely - the rest of the website keeps working either way.',

    features: [
      'Placeholder - add real features when this app is built',
      'Placeholder - add real requirements when known',
    ],

    screenshots: [{ label: 'Preview', glyph: 'compass', image: null }],

    whatsNew: [],

    download: {
      state: DOWNLOAD_STATES.COMING_SOON,
      url: null,
      fileName: null,
      sizeMb: null,
      note: 'Nothing to download yet - this app has not been released.',
    },

    update: {
      latestVersion: null,
      updateUrl: null,
      releaseNotes: [],
      channel: 'Stable',
      releaseChannel: 'Public',
      autoUpdate: false,
      support: 'Updates will be published manually by ChielSam.',
      checkEndpoint: null,
    },

    releases: [],

    featured: false,
    releasedAt: null,
    updatedAt: null,
    rating: 'Not released',
    downloads: '—',
  },
]

export function getAllApps() {
  return APPS
}

export function getAppById(id) {
  return APPS.find((app) => app.id === id)
}

export function getAppBySlug(slug) {
  return APPS.find((app) => app.slug === slug)
}

export function isReleased(app) {
  return typeof app.version === 'string' && app.version.length > 0
}

export function getDisplayVersion(app) {
  return isReleased(app) ? `v${app.version}` : 'Not released'
}

export function getStatusTone(status) {
  if (status === APP_STATUS.AVAILABLE) return 'success'
  if (status === APP_STATUS.IN_REVIEW) return 'warning'
  return 'brand'
}

export function getPlatformLabel(app) {
  return isReleased(app) ? `${app.platform} · v${app.version}` : `${app.platform} · unreleased`
}

export function getFeaturedApps() {
  return APPS.filter((app) => app.featured)
}

export function getCategories() {
  const used = APPS.map((app) => app.category)
  return APP_CATEGORIES.filter((category) => category === 'All' || used.includes(category))
}

export function getReleasesForApp(app) {
  return app.releases
}

export function getLatestRelease(app) {
  if (app.releases.length === 0) return null
  return app.releases.find((release) => release.isCurrent) || app.releases[0]
}

/**
 * A pending update only exists when `update.latestVersion` is set to a version
 * newer than the published one. It is null for every app today, so the hub
 * correctly shows "No new update available".
 */
export function getPendingUpdate(app) {
  if (!isReleased(app) || !app.update.latestVersion) return null

  return {
    latestVersion: app.update.latestVersion,
    releaseNotes: app.update.releaseNotes || [],
    updateUrl: app.update.updateUrl || null,
  }
}

export function getAppsWithPendingUpdates() {
  return APPS.filter((app) => getPendingUpdate(app) !== null)
}

export function getAllReleases() {
  return APPS.flatMap((app) =>
    app.releases.map((release) => ({
      ...release,
      appId: app.id,
      appSlug: app.slug,
      appName: app.name,
      appIcon: app.icon,
      appCategory: app.category,
    })),
  ).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getHubStats() {
  const releases = getAllReleases()

  return {
    totalApps: APPS.length,
    available: APPS.filter((app) => app.status === APP_STATUS.AVAILABLE).length,
    comingSoon: APPS.filter((app) => app.status === APP_STATUS.COMING_SOON).length,
    categories: new Set(APPS.map((app) => app.category)).size,
    releases: releases.length,
    latestVersion: releases[0]?.version || null,
    latestReleaseApp: releases[0]?.appName || null,
    appsWithUpdates: getAppsWithPendingUpdates().length,
  }
}
