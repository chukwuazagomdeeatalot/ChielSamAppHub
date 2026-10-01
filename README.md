# CHIELSAM APP HUB

The official multi-app distribution website for apps built by **ChielSam**.

## What this project is

CHIELSAM APP HUB is the public home for every app ChielSam builds. Visitors can browse the app
catalogue, open any app for full details, read its release notes and see whether a newer version
exists. The first app published is **ORINZA** (Entertainment, version 1.0.0).

Built with Vite + React + React Router. Plain JavaScript and plain CSS, with only three runtime
dependencies, so it loads quickly and is easy to maintain.

## Current status: Phase 4 — multi-app platform

The hub now runs on a full multi-app data model and is deployed automatically to GitHub Pages.

- Home, Apps, App Details, Owner Dashboard and About pages, all responsive
- Any number of apps, all driven by one data source (`src/data/apps.js`)
- Per-app features, screenshots, version history, release notes, download state and update state
- ORINZA is the first published app (Entertainment, v1.0.0)
- Automatic deployment: push to `main` and the site rebuilds in the cloud

**Still placeholders / not implemented** (deliberately):

- No APK files are hosted — download buttons stay disabled
- No owner authentication, so the dashboard is a read-only preview
- The "Add App" form does not save anything; apps are added as data objects
- No Firebase, no file uploads, no automatic in-app updates
- Update results are read from local app data and are labelled as such

## 1. Run the website

```bash
npm install     # only needed the first time
npm run dev     # start the local website
```

Open the address Vite prints in the browser, normally <http://127.0.0.1:5173>

## 2. Build for production

```bash
npm run build     # create a production copy in dist/
npm run preview   # preview the production build locally
```

`npm run build` outputs a static site into `dist/`. It uses relative paths, so the built site
works on any static host and in any subfolder.

## 3. Project structure

```
ChielSamAppHub/
├─ index.html            page shell
├─ vite.config.js        dev server + build settings
├─ public/favicon.svg    site icon
└─ src/
   ├─ main.jsx           React entry point
   ├─ App.jsx            routes (which URL shows which page)
   ├─ data/apps.js       ALL app information lives here
   ├─ services/
   │  └─ updateService.js  update checking (local now, API later)
   ├─ hooks/
   │  └─ useUpdateStatus.js  reads update state for one app
   ├─ components/        reusable pieces (cards, download button,
   │                     version history, add-app form, icons…)
   ├─ pages/             Home, Apps, AppDetails, Dashboard, About
   └─ styles/            design tokens + CSS for the whole site
```

## 4. Add a new app

Open `src/data/apps.js` and add one more object to the `APPS` array, copying the ORINZA entry.
`id` and `slug` are the only two things that must be new.

```js
{
  id: 'app_my_app',             // unique id
  name: 'MY APP',
  slug: 'my-app',              // URL: /apps/my-app   (no spaces)
  tagline: 'A short tagline for the featured area.',
  category: 'Utilities',
  status: APP_STATUS.AVAILABLE, // or COMING_SOON / IN_REVIEW
  publisher: 'ChielSam',

  icon: {
    type: 'generated',
    initials: 'M',                    // shown on the generated app icon
    gradient: ['#7c3aed', '#2563eb'], // icon colours
    alt: 'MY APP app icon',
  },

  platform: 'Android',
  platformDetails: {
    minimum: 'Android 8.0+',
    architectures: 'Universal',
    requirements: 'Internet not required',
  },

  version: '1.0.0',              // null until the app is really released
  shortDescription: 'One or two sentences shown on app cards.',
  description: 'The full description shown on the app page.',
  features: ['A feature.', 'Another feature.'],

  screenshots: [{ label: 'Home', glyph: 'home', image: null }],
  whatsNew: ['First release.', 'Another change.'],

  download: {
    state: DOWNLOAD_STATES.COMING_SOON, // or AVAILABLE
    url: null,                          // only fill in a REAL file url
    fileName: null,
    sizeMb: null,
    note: 'No APK is hosted yet.',
  },

  update: {
    latestVersion: null,          // set only when a newer version exists
    updateUrl: null,              // only a REAL file url
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
      date: '2026-10-01',
      type: 'Initial release',
      notes: ['First release.'],
      isCurrent: true,
    },
  ],

  featured: false,
  releasedAt: '2026-10-01',
  updatedAt: '2026-10-01',
  downloads: '—',
  rating: 'New',
}
```

The new app then appears automatically on Home, the Apps catalogue, its own page at
`/apps/my-app`, the search results, the dashboard app list, the release list and the update
status panel. No other file needs editing.

**Important:** only add a release to `releases` when it genuinely happened. Never list a
placeholder version as real history — the site is a distribution point and must stay truthful.

## 5. Git workflow

This project is a Git repository. `node_modules/`, `dist/`, `.env` files and editor folders are
excluded by `.gitignore` and must never be committed.

```bash
git status                  # see what changed
git add .                   # stage the project files
git commit -m "message"     # save a version locally
git log --oneline           # list saved versions
```

## 6. Automatic deployment with GitHub Actions

The site is deployed automatically to **GitHub Pages**. Pushing to `main` triggers a workflow that
builds the site in the cloud and publishes it — **your laptop does not need to be running
afterwards**.

- Workflow file: `.github/workflows/deploy.yml`
- Triggers on every push to `main`, and can also be run manually from the Actions tab
  ("Run workflow")
- Steps: checkout → set up Node 20 → `npm ci` → `npm run build` → upload `dist/` → deploy
- Vite is configured with `base: '/ChielSamAppHub/'` in `vite.config.js`, because Pages serves the
  site from `https://<user>.github.io/ChielSamAppHub/`. If the repository is ever renamed, that one
  value must change to match.
- No secrets are stored in the workflow. GitHub provides a short-lived token automatically.

Live site: <https://chukwuazagomdeeatalot.github.io/ChielSamAppHub/>

One-time manual setting required: in **Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**. See the note below.

To see the deployment history, open the repository's **Actions** tab.

## 7. Connecting a real backend later

`src/services/updateService.js` already exposes these functions:

```js
getUpdateStatus(appSlug, installedVersion) // -> Promise<UpdateResult>
getAppUpdate(app, installedVersion)        // -> UpdateResult (no await needed)
```

Every `UpdateResult` always contains `currentVersion`, `latestVersion`, `updateAvailable`,
`releaseNotes` and `updateUrl`, plus a `source` / `isMock` flag so the interface can label local
data honestly.

To go live you set `UPDATE_BACKEND.mode = 'remote'`, fill in `UPDATE_BACKEND.endpoint`, and make
that endpoint return the same fields. No page or component has to change.

## 8. What is NOT in Phase 1

- No APK download links (the download button is a disabled placeholder)
- No owner login / authentication
- No file uploads or Firebase
- No automatic in-app updates for the published apps

All of these are shown as clearly marked placeholders so the layout is ready for them.
Automatic *deployment* of the website itself is already working — see section 6.
