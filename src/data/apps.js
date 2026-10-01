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

export const APPS = [
  {
    slug: 'orinza',
    name: 'ORINZA',
    initials: 'O',
    gradient: ['#7c3aed', '#2563eb'],
    category: 'Entertainment',
    status: APP_STATUS.AVAILABLE,
    version: '1.0.0',
    size: 'Pending',
    platform: 'Android',
    minRequirement: 'Android 8.0+',
    publisher: 'ChielSam',
    shortDescription:
      'A fresh entertainment experience built for quick, distraction-free fun on your phone.',
    description:
      'ORINZA is the first app published on CHIELSAM APP HUB. It is built as a lightweight, fast entertainment companion that keeps everything a few taps away, so you can get to the good part without digging through menus. Version 1.0.0 is the first public release, and every future improvement will be tracked here on the hub with a clear version number, release date and change list.',
    tagline: 'Entertainment, without the noise.',
    featured: true,
    updatedAt: '2026-09-28',
    releasedAt: '2026-09-28',
    downloads: '—',
    rating: 'New',
    whatsNew: [
      'First public release of ORINZA.',
      'Core entertainment experience and navigation.',
      'Prepared for future feature updates through CHIELSAM APP HUB.',
    ],
    updateInfo: {
      channel: 'Stable',
      releaseChannel: 'Public',
      autoUpdate: 'Not available in Phase 1',
      support: 'Updates are published manually by ChielSam.',
    },
    screenshots: [
      { label: 'Home', glyph: 'home' },
      { label: 'Discover', glyph: 'compass' },
      { label: 'Library', glyph: 'layers' },
      { label: 'Settings', glyph: 'settings' },
    ],
  },
]

export function getAllApps() {
  return APPS
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

export function getAllReleases() {
  return APPS.flatMap((app) => ({
    appSlug: app.slug,
    appName: app.name,
    initials: app.initials,
    gradient: app.gradient,
    version: app.version,
    date: app.releasedAt,
    type: 'Initial release',
    notes: app.whatsNew,
  })).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getHubStats() {
  return {
    totalApps: APPS.length,
    available: APPS.filter((app) => app.status === APP_STATUS.AVAILABLE).length,
    categories: new Set(APPS.map((app) => app.category)).size,
    releases: getAllReleases().length,
  }
}
