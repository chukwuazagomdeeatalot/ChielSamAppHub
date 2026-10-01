import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from '../src/pages/Home'
import Apps from '../src/pages/Apps'
import AppDetails from '../src/pages/AppDetails'
import Dashboard from '../src/pages/Dashboard'
import About from '../src/pages/About'
import NotFound from '../src/pages/NotFound'
import DownloadButton from '../src/components/DownloadButton'
import { getAllApps, getAppById, getAppBySlug } from '../src/data/apps'
import { ARTIFACT_TYPES, RELEASES, RELEASE_STATUS, getAllReleaseRecords } from '../src/data/releases'
import {
  compareVersions,
  getAllReleases,
  getAppReleaseMeta,
  getAppsWithPreparedUpdates,
  getCurrentRelease,
  getHubStats,
  getLatestRelease,
  getPreparedRelease,
  getReleaseStatus,
  getReleasesForApp,
  getUpdateAvailability,
} from '../src/services/releaseService'
import { getAppUpdate, getUpdateStatus, UPDATE_STATES } from '../src/services/updateService'

let failures = 0
let checks = 0

function check(name, condition, detail = '') {
  checks += 1

  if (condition) {
    console.log(`  PASS  ${name}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${name} ${detail}`)
  }
}

/* ---------------- render ---------------- */

const CASES = [
  { label: '/', route: '/', entry: '/', Page: Home, expect: ['CHIELSAM APP HUB', 'Discover My Apps', 'ORINZA', 'Latest updates'] },
  { label: '/apps', route: '/apps', entry: '/apps', Page: Apps, expect: ['All apps', 'ORINZA', 'View Details', 'published by ChielSam', 'Showing 1 of 1'] },
  { label: '/apps/orinza', route: '/apps/:slug', entry: '/apps/orinza', Page: AppDetails, expect: ['ORINZA', 'Current release', 'v1.0.0', '2026-09-28', 'Version history', 'Build artifacts', 'Download coming soon', "What&#x27;s New", 'Future update flow', 'UPDATE AVAILABLE'] },
  { label: '/apps/missing', route: '/apps/:slug', entry: '/apps/missing', Page: AppDetails, expect: ['App not found'] },
  { label: '/dashboard', route: '/dashboard', entry: '/dashboard', Page: Dashboard, expect: ['Overview', 'My Apps', 'Releases', 'Updates', 'Current version:', 'Latest release', 'Release status', 'Create New Release', 'Current'] },
  { label: '/about', route: '/about', entry: '/about', Page: About, expect: ['About CHIELSAM APP HUB'] },
  { label: '/404', route: '*', entry: '/nope', Page: NotFound, expect: ['Page not found'] },
]

/* JSX splits adjacent text nodes with `<!-- -->` markers, which breaks naive
   substring checks on SSR output. Strip them and collapse whitespace. */
function normalize(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ')
}

console.log('RENDER TESTS')
for (const { label, route, entry, Page, expect } of CASES) {
  let html = ''
  let error = null

  try {
    html = renderToString(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path={route} element={<Page />} />
        </Routes>
      </MemoryRouter>,
    )
  } catch (caught) {
    error = caught
  }

  check(`${label} renders`, !error && html.length > 200, error ? `-> ${error.message}` : `len=${html.length}`)

  if (expect && !error) {
    const text = normalize(html)
    for (const expected of expect) {
      check(`${label} contains "${expected}"`, text.includes(expected))
    }
  }
}

/* ---------------- test app removed ---------------- */

console.log('')
console.log('TEST APP REMOVED')
check('only one app in catalogue', getAllApps().length === 1, `got ${getAllApps().length}`)
check('no NEXT APP entry', getAllApps().every((app) => app.name !== 'NEXT APP'))
check('no next-app slug', getAppBySlug('next-app') === undefined)
check('no placeholder app id', getAppById('app_placeholder_next') === undefined)
check('ORINZA is the app', getAllApps()[0].id === 'app_orinza')

const homeHtml = renderToString(
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </MemoryRouter>,
)
const appsHtml = renderToString(
  <MemoryRouter initialEntries={['/apps']}>
    <Routes>
      <Route path="/apps" element={<Apps />} />
    </Routes>
  </MemoryRouter>,
)
check('NEXT APP not on home', !normalize(homeHtml).includes('NEXT APP'))
check('NEXT APP not in catalogue', !normalize(appsHtml).includes('NEXT APP'))

/* ---------------- release model ---------------- */

console.log('')
console.log('RELEASE MODEL')
const orinza = getAppBySlug('orinza')
const releases = getReleasesForApp(orinza.id)

check('one release for ORINZA', releases.length === 1, `got ${releases.length}`)
check('release belongs to app', releases[0].appId === 'app_orinza')
check('release version 1.0.0', releases[0].version === '1.0.0')
check('release date is real', releases[0].releaseDate === '2026-09-28')
check('release notes present', typeof releases[0].releaseNotes === 'string' && releases[0].releaseNotes.length > 0)
check('changes list present', releases[0].changes.length === 3)
check('minimum supported version', releases[0].minimumSupportedVersion === 'Android 8.0')
check('platform recorded', releases[0].platform === 'Android')
check('artifact type modelled', releases[0].artifactType === ARTIFACT_TYPES.APK)
check('no artifact url invented', releases[0].artifactUrl === null)
check('no artifact name invented', releases[0].artifactName === null)
check('no checksum invented', releases[0].checksum === null)
check('no build id invented', releases[0].buildId === null)
check('status is current', releases[0].status === RELEASE_STATUS.CURRENT)
check('data flagged as local/mock', releases[0].isMock === true)
check('every record has the full shape', getAllReleaseRecords().every(
  (r) =>
    'appId' in r && 'version' in r && 'releaseDate' in r && 'releaseNotes' in r &&
    'changes' in r && 'minimumSupportedVersion' in r && 'platform' in r &&
    'status' in r && 'artifactName' in r && 'artifactUrl' in r &&
    'artifactType' in r && 'checksum' in r && 'buildId' in r,
))
check('no duplicate release versions', new Set(getAllReleaseRecords().map((r) => r.version)).size === getAllReleaseRecords().length)
check('only one CURRENT per app', RELEASES.filter((r) => r.status === RELEASE_STATUS.CURRENT).length === new Set(RELEASES.map((r) => r.appId)).size)

/* ---------------- release service ---------------- */

console.log('')
console.log('RELEASE SERVICE')
check('getCurrentRelease returns v1.0.0', getCurrentRelease(orinza.id)?.version === '1.0.0')
check('getLatestRelease returns v1.0.0', getLatestRelease(orinza.id)?.version === '1.0.0')
check('getLatestRelease null for unknown app', getLatestRelease('nope') === null)
check('getCurrentRelease null for unknown app', getCurrentRelease('nope') === null)
check('getReleasesForApp empty for unknown', getReleasesForApp('nope').length === 0)
check('getPreparedRelease null today', getPreparedRelease(orinza.id) === null)
check('no prepared updates', getAppsWithPreparedUpdates().length === 0)

const status = getReleaseStatus(getCurrentRelease(orinza.id))
check('release status label Current', status.label === 'Current')
check('release status isCurrent', status.isCurrent === true)
check('release status isPublished', status.isPublished === true)
check('release status hasArtifact false', status.hasArtifact === false)
check('release status for null', getReleaseStatus(null).label === 'No release')

const versionCases = [
  ['1.0.0 vs 1.0.0 is equal', compareVersions('1.0.0', '1.0.0'), 0],
  ['1.0.1 > 1.0.0', compareVersions('1.0.1', '1.0.0'), 1],
  ['1.0.0 < 1.0.1', compareVersions('1.0.0', '1.0.1'), -1],
  ['v1.10.0 > 1.9.0', compareVersions('v1.10.0', '1.9.0'), 1],
  ['2.0.0 > 1.99.99', compareVersions('2.0.0', '1.99.99'), 1],
  ['null compares safely', compareVersions(null, '1.0.0'), 0],
]
for (const [name, actual, expected] of versionCases) {
  check(name, actual === expected, `got ${actual}`)
}

const meta = getAppReleaseMeta(orinza.id)
check('meta currentVersion', meta.currentVersion === '1.0.0')
check('meta releaseDate', meta.releaseDate === '2026-09-28')
check('meta whatsNew has 3 items', meta.whatsNew.length === 3)
check('meta releaseCount 1', meta.releaseCount === 1)
check('meta hasUpdate false', meta.hasUpdate === false)
check('meta minimum supported', meta.minimumSupportedVersion === 'Android 8.0')

const upToDate = getUpdateAvailability(orinza.id)
check('no update available today', upToDate.updateAvailable === false)
check('update not ready', upToDate.updateReady === false)
check('update url null', upToDate.updateUrl === null)
check('reason up-to-date', upToDate.reason === 'up-to-date')

const behind = getUpdateAvailability(orinza.id, '0.9.0')
check('visitor on 0.9.0 sees 1.0.0 as newer', behind.updateAvailable === true, JSON.stringify(behind))
check('but update is not installable', behind.updateReady === false)
check('and no update url exists', behind.updateUrl === null)

const sameVersion = getUpdateAvailability(orinza.id, '1.0.0')
check('visitor on 1.0.0 sees no update', sameVersion.updateAvailable === false)

const newerVersion = getUpdateAvailability(orinza.id, '2.0.0')
check('visitor ahead of catalogue sees no update', newerVersion.updateAvailable === false)

const stats = getHubStats()
check('stats totalApps 1', stats.totalApps === 1)
check('stats available 1', stats.available === 1)
check('stats releases 1', stats.releases === 1)
check('stats currentReleases 1', stats.currentReleases === 1)
check('stats latestVersion 1.0.0', stats.latestVersion === '1.0.0')
check('stats latestReleaseApp ORINZA', stats.latestReleaseApp === 'ORINZA')
check('getAllReleases has 1 entry', getAllReleases().length === 1)
check('getAllReleases carries app name', getAllReleases()[0].appName === 'ORINZA')
check('getAllReleases marks current', getAllReleases()[0].isCurrent === true)

/* ---------------- update service ---------------- */

console.log('')
console.log('UPDATE SERVICE')
const update = getAppUpdate(orinza)
check('update state up-to-date', update.state === UPDATE_STATES.UP_TO_DATE)
check('update latestVersion 1.0.0', update.latestVersion === '1.0.0')
check('updateAvailable false', update.updateAvailable === false)
check('update url null', update.updateUrl === null)
check('update labelled mock', update.isMock === true)
check('no fake update banner', !update.updateAvailable)

const unknown = getAppUpdate(null)
check('unknown app state', unknown.state === UPDATE_STATES.UNKNOWN)

/* ---------------- download button ---------------- */

console.log('')
console.log('DOWNLOAD BUTTON')
const comingSoon = renderToString(<DownloadButton app={orinza} update={null} />)
check('ORINZA shows Download coming soon', normalize(comingSoon).includes('Download coming soon'))
check('ORINZA download button disabled', comingSoon.includes('disabled'))
check('ORINZA has no href', !comingSoon.includes('href='))

const available = {
  ...orinza,
  download: { ...orinza.download, state: 'available', url: 'https://example.com/orinza.apk' },
}
const availableHtml = renderToString(<DownloadButton app={available} update={null} />)
check('available state renders a link', availableHtml.includes('href="https://example.com/orinza.apk"'))
check('available state not disabled', !availableHtml.includes('disabled'))

const updateReady = renderToString(
  <DownloadButton app={orinza} update={{ updateAvailable: true, latestVersion: '1.0.1', updateUrl: 'https://example.com/1.0.1.apk' }} />,
)
check('update-available shows version', normalize(updateReady).includes('Update to v1.0.1'))
check('update-available links file', updateReady.includes('href="https://example.com/1.0.1.apk"'))

const updateNoFile = renderToString(
  <DownloadButton app={orinza} update={{ updateAvailable: true, latestVersion: '1.0.1', updateUrl: null }} />,
)
check('update-coming-soon label', normalize(updateNoFile).includes('Update coming soon'))
check('update-coming-soon disabled', updateNoFile.includes('disabled'))

/* ---------------- no fabricated data ---------------- */

console.log('')
console.log('NO FABRICATED DATA')
const allHtml = [
  homeHtml,
  appsHtml,
  ...CASES.filter((c) => c.label !== '/404').map((c) =>
    renderToString(
      <MemoryRouter initialEntries={[c.entry]}>
        <Routes>
          <Route path={c.route} element={<c.Page />} />
        </Routes>
      </MemoryRouter>,
    ),
  ),
].join(' ')

check('no fake apk link in html', !/\.apk["']/i.test(allHtml.replace(/https:\/\/example\.com[^"' ]*/g, '')))
check('no invented http download urls', !/href="https?:\/\/(?!example\.com)[^"]*(\.apk|\.aab|download)/i.test(allHtml))
check('all release artifact urls are null', getAllReleaseRecords().every((r) => r.artifactUrl === null))
check('all app download urls are null', getAllApps().every((a) => a.download.url === null))
check('ORINZA status available', orinza.status === 'Available')

console.log('')
console.log(`${checks} checks run`)
if (failures > 0) {
  console.log(`${failures} FAILURE(S)`)
  process.exit(1)
}
console.log('ALL CHECKS PASSED')
