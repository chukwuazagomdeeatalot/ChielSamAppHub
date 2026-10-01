# CHIELSAM APP HUB

The official multi-app distribution website for apps built by **ChielSam**.

## What this project is

CHIELSAM APP HUB is the public home for every app ChielSam builds. Visitors can browse the app
catalogue, open any app for full details, read its release notes and see whether a newer version
exists. The first app published is **ORINZA** (Entertainment, version 1.0.0).

Built with Vite + React + React Router. Plain JavaScript and plain CSS, with only three runtime
dependencies, so it loads quickly and is easy to maintain.

## Current status: Phase 1 complete

Phase 1 (website foundation and responsive UI) is finished and working:

- Home, Apps, App Details, Owner Dashboard (preview) and About pages
- Responsive on desktop, tablet and Android phone
- ORINZA published as the first sample app

**Not part of Phase 1** (deliberately placeholders for now):

- No APK files are hosted — the download button is a disabled placeholder
- No owner authentication — the dashboard is a read-only visual preview
- No Firebase, no file uploads, no automatic in-app updates

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
   ├─ components/        reusable pieces (navbar, cards, icons…)
   ├─ pages/             Home, Apps, AppDetails, Dashboard, About
   └─ styles/            design tokens + CSS for the whole site
```

## 4. Add a new app

Open `src/data/apps.js` and add one more object to the `APPS` array, copying the ORINZA entry:

```js
{
  slug: 'my-app',              // URL: /apps/my-app   (no spaces)
  name: 'MY APP',
  initials: 'M',               // shown on the generated app icon
  gradient: ['#7c3aed', '#2563eb'],  // icon colours
  category: 'Utilities',
  status: APP_STATUS.AVAILABLE,
  version: '1.0.0',
  size: 'Pending',
  platform: 'Android',
  minRequirement: 'Android 8.0+',
  publisher: 'ChielSam',
  shortDescription: 'One or two sentences shown on app cards.',
  description: 'The full description shown on the app page.',
  tagline: 'A short tagline for the featured area.',
  featured: false,
  updatedAt: '2026-10-01',
  releasedAt: '2026-10-01',
  downloads: '—',
  rating: 'New',
  whatsNew: ['First release.', 'Another change.'],
  updateInfo: {
    channel: 'Stable',
    releaseChannel: 'Public',
    autoUpdate: 'Not available in Phase 1',
    support: 'Updates are published manually by ChielSam.',
  },
  screenshots: [{ label: 'Home', glyph: 'home' }],
}
```

The new app then appears automatically on Home, Apps, the search results, the dashboard and the
release timeline. No other file needs editing.

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

`src/services/updateService.js` already exposes one function:

```js
getUpdateStatus(appSlug, installedVersion) // -> Promise<UpdateResult>
```

Every component reads only this payload, so to go live you set `UPDATE_BACKEND.mode = 'remote'`,
fill in `UPDATE_BACKEND.endpoint`, and make that endpoint return the same shape. No page or
component has to change.

## 8. What is NOT in Phase 1

- No APK download links (the download button is a disabled placeholder)
- No owner login / authentication
- No file uploads or Firebase
- No automatic in-app updates for the published apps

All of these are shown as clearly marked placeholders so the layout is ready for them.
Automatic *deployment* of the website itself is already working — see section 6.
