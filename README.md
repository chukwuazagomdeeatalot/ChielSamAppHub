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

## 6. Future GitHub / cloud deployment plan

The site is a static build, so it can be hosted for free. The intended order of steps:

1. Create a **private** GitHub repository (owner decides the name and visibility).
2. Connect it: `git remote add origin <url>` then `git push -u origin main`.
3. Let **GitHub Actions** run `npm ci && npm run build` on every push (workflow not added yet —
   it will be created once the remote exists).
4. Publish the `dist/` folder, either to GitHub Pages or to a free static host such as
   Cloudflare Pages or Vercel.
5. Later phases, only after the site is live: owner authentication, real APK hosting, then
   automatic update checks pointed at a real endpoint.

**No remote is configured yet**, and nothing has been pushed anywhere. The remote must be added
manually once the GitHub repository has been created.

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
- No automatic in-app updates

All of these are shown as clearly marked placeholders so the layout is ready for them.
