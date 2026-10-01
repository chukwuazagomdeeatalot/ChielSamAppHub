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
 * This file holds APP DATA ONLY. Version, release date, release notes and
 * update state are not stored here - they belong to a release and are read
 * from `src/data/releases.js` through `src/services/releaseService.js`. That
 * keeps one single source of truth for every version number on the site.
 *
 * To publish a new app: copy the ORINZA object, give it a new `id` and `slug`,
 * then add its first real release in `src/data/releases.js`. It then appears
 * automatically on the Apps page, Home, its own details route and the
 * dashboard. No other file is edited.
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

    /** Permanent Android identity of the installed app. */
    android: {
      applicationId: 'com.chielsam.orinza',
      deliveredFrom: 'GitHub Releases',
    },

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

    download: {
      state: DOWNLOAD_STATES.COMING_SOON,
      url: null,
      fileName: null,
      sizeMb: null,
      note: 'No APK is hosted yet. The download link appears here once a signed APK is published as a GitHub Release.',
    },

    update: {
      channel: 'Stable',
      releaseChannel: 'Public',
      autoUpdate: false,
      support: 'Updates are published manually by ChielSam.',
      checkEndpoint: null,
    },

    featured: true,
    rating: 'New',
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

export function getFeaturedApps() {
  return APPS.filter((app) => app.featured)
}

export function getCategories() {
  const used = APPS.map((app) => app.category)
  return APP_CATEGORIES.filter((category) => category === 'All' || used.includes(category))
}

export function getStatusTone(status) {
  if (status === APP_STATUS.AVAILABLE) return 'success'
  if (status === APP_STATUS.IN_REVIEW) return 'warning'
  return 'brand'
}
