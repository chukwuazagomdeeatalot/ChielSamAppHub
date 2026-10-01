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
  formatFileSize,
  getAllReleases,
  getAppReleaseMeta,
  getAppsWithPreparedUpdates,
  getArtifactAvailability,
  getCurrentRelease,
  getExpectedApkFileName,
  getHubStats,
  getLatestRelease,
  getPreparedRelease,
  getReleaseStatus,
  getReleasesForApp,
  getUpdateAvailability,
  isReleaseDownloadable,
} from '../src/services/releaseService'
import { getAppUpdate, getUpdateStatus, UPDATE_STATES } from '../src/services/updateService'
import {
  DISTRIBUTION,
  buildReleaseAssetUrl,
  getReleaseAssetUrl,
  hasConfiguredAssets,
} from '../src/data/distribution'

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
  { label: '/apps/orinza', route: '/apps/:slug', entry: '/apps/orinza', Page: AppDetails, expect: ['ORINZA', 'Current release', 'v1.0.0', '2026-09-28', 'Version history', 'Build artifacts', 'Download v1.0.0', "What&#x27;s New", 'Future update flow', 'UPDATE AVAILABLE'] },
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
check('artifact url still null - distribution builds it', releases[0].artifactUrl === null)
check('artifact name recorded', releases[0].artifactName === 'ORINZA-v1.0.0.apk')
check('checksum recorded', releases[0].checksum === '1BEF8B796AA24809E948EA912963EB4746BCD99ABE1997E6EECF091B60C7A9D5')
check('build id left null - no genuine build id', releases[0].buildId === null)
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
check('update is installable with a real artifact', behind.updateReady === true)
check('update url is the real GitHub asset', behind.updateUrl === 'https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk')

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

/**
 * Test fixture URL. `example.com` is reserved for documentation, so this can
 * never resolve to a real ORINZA build. The site itself ships no url at all.
 */
const EXAMPLE_ASSET = 'https://example.com/releases/download/v1.0.0/ORINZA-v1.0.0.apk'

const comingSoon = renderToString(<DownloadButton app={orinza} update={null} />)
check('ORINZA shows Download v1.0.0', normalize(comingSoon).includes('Download v1.0.0'))
check('ORINZA download button enabled', !comingSoon.includes('disabled'))
check('ORINZA has real href', comingSoon.includes('href="https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk"'))

// A url on the app object alone must NOT override the release record: the
// distribution config is the authority, so an app-only url is ignored.
const urlOnAppOnly = {
  ...orinza,
  download: { ...orinza.download, state: 'available', url: EXAMPLE_ASSET },
}
const urlOnAppOnlyHtml = renderToString(<DownloadButton app={urlOnAppOnly} update={null} />)
check('app-only url does not override distribution', !urlOnAppOnlyHtml.includes(EXAMPLE_ASSET))
check('app-only url still uses real distribution link', urlOnAppOnlyHtml.includes('releases/download/v1.0.0/ORINZA-v1.0.0.apk'))

// With a real artifact on the release record, the same button becomes a link.
// The distribution config already supplies the real URL, so this test exercises
// the same validation path with a literal artifactUrl override.
const orinzaRelease = RELEASES.find((r) => r.appId === 'app_orinza')
const savedArtifact = { ...orinzaRelease }
orinzaRelease.artifactUrl = EXAMPLE_ASSET
orinzaRelease.artifactName = 'ORINZA-v1.0.0.apk'
orinzaRelease.artifactSizeMb = 12.5

const availableHtml = renderToString(
  <DownloadButton app={{ ...orinza, download: { ...orinza.download, state: 'available' } }} update={null} />,
)
check('real artifact renders a link', availableHtml.includes(`href="${EXAMPLE_ASSET}"`))
check('real artifact not disabled', !availableHtml.includes('disabled'))
check('link carries the apk file name', availableHtml.includes('download="ORINZA-v1.0.0.apk"'))
check('download hint shows size', normalize(availableHtml).includes('12.5 MB'))

// The distribution config still produces the canonical URL even when the
// release record has no literal artifactUrl.
Object.assign(orinzaRelease, savedArtifact)
const distHtml = renderToString(<DownloadButton app={orinza} update={null} />)
check('distribution config produces canonical url', distHtml.includes('href="https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk"'))
check('distribution config url is enabled', !distHtml.includes('disabled'))

const updateReady = renderToString(
  <DownloadButton
    app={orinza}
    update={{
      updateAvailable: true,
      updateReady: true,
      latestVersion: '1.0.1',
      updateUrl: EXAMPLE_ASSET,
      updateFileName: 'ORINZA-v1.0.1.apk',
    }}
  />,
)
check('update-available shows version', normalize(updateReady).includes('Update to v1.0.1'))
check('update-available links file', updateReady.includes(`href="${EXAMPLE_ASSET}"`))

const updateUnready = renderToString(
  <DownloadButton app={orinza} update={{ updateAvailable: true, updateReady: false, latestVersion: '1.0.1', updateUrl: EXAMPLE_ASSET }} />,
)
check('update without ready flag stays disabled', updateUnready.includes('disabled'))
check('update without ready flag has no href', !updateUnready.includes('href='))

const updateNoFile = renderToString(
  <DownloadButton app={orinza} update={{ updateAvailable: true, updateReady: true, latestVersion: '1.0.1', updateUrl: null }} />,
)
check('update-coming-soon label', normalize(updateNoFile).includes('Update coming soon'))
check('update-coming-soon disabled', updateNoFile.includes('disabled'))

/* ---------------- release distribution ---------------- */

console.log('')
console.log('RELEASE DISTRIBUTION')

const currentRelease = getCurrentRelease(orinza.id)
const availability = getArtifactAvailability(currentRelease)

// ORINZA now has a real distribution config, so it IS downloadable.
check('ORINZA is downloadable', availability.downloadable === true)
check('isReleaseDownloadable agrees', isReleaseDownloadable(currentRelease) === true)
check('meta reports downloadable', meta.isDownloadable === true)
check('meta download url is real', meta.downloadUrl === 'https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk')
check('availability has no blocking issues', availability.issues.length === 0)
check('availability reports real file name', availability.fileName === 'ORINZA-v1.0.0.apk')
check('no issues on a null release', getArtifactAvailability(null).downloadable === false)

// Release metadata is complete enough to describe a real build.
check('release has a version code', currentRelease.versionCode === 1)
check('release has a channel', typeof currentRelease.channel === 'string' && currentRelease.channel.length > 0)
check('release has a release date', currentRelease.releaseDate === '2026-09-28')
check('release has release notes', currentRelease.releaseNotes.length > 0)
check('release has a minimum android version', currentRelease.minimumSupportedVersion === 'Android 8.0')
check('every release record has a version code', getAllReleaseRecords().every((r) => typeof r.versionCode === 'number'))
check('meta exposes version code', meta.currentVersionCode === 1)

// Expected asset naming convention matches the configured asset.
check('expected apk name for ORINZA', getExpectedApkFileName('ORINZA', '1.0.0', ARTIFACT_TYPES.APK) === 'ORINZA-v1.0.0.apk')
check('expected name on meta', meta.expectedFileName === 'ORINZA-v1.0.0.apk')
check('download file name is the configured asset', meta.downloadFileName === 'ORINZA-v1.0.0.apk')
check('aab convention uses .aab', getExpectedApkFileName('ORINZA', '2.0.0', ARTIFACT_TYPES.AAB) === 'ORINZA-v2.0.0.aab')
check('expected name needs app and version', getExpectedApkFileName(null, '1.0.0', ARTIFACT_TYPES.APK) === null)

// The distribution config is the single place that makes a download live.
check('distribution provider is github releases', DISTRIBUTION.provider === 'github-releases')
check('distribution names the repository', DISTRIBUTION.repository.name === 'ChielSamAppHub')
check('ORINZA v1.0.0 asset is configured', hasConfiguredAssets() === true)
check('ORINZA distribution tag is v1.0.0', getAssetLocation('app_orinza', '1.0.0')?.tag === 'v1.0.0')
check('ORINZA distribution asset is ORINZA-v1.0.0.apk', getAssetLocation('app_orinza', '1.0.0')?.asset === 'ORINZA-v1.0.0.apk')
check('null tag yields no url', buildReleaseAssetUrl({ tag: null, asset: 'ORINZA-v1.0.0.apk' }) === null)
check('null asset yields no url', buildReleaseAssetUrl({ tag: 'v1.0.0', asset: null }) === null)
check('empty strings yield no url', buildReleaseAssetUrl({ tag: '   ', asset: '  ' }) === null)
check('no url without arguments', buildReleaseAssetUrl() === null)

const builtUrl = buildReleaseAssetUrl({ tag: 'v1.0.0', asset: 'ORINZA-v1.0.0.apk' })
check('complete config builds a url', builtUrl === 'https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk')
check('built url encodes spaces', buildReleaseAssetUrl({ tag: 'v1.0.0', asset: 'my file.apk' }).endsWith('/my%20file.apk'))
check('getReleaseAssetUrl resolves from distribution config', getReleaseAssetUrl('app_orinza', '1.0.0', null) === 'https://github.com/chukwuazagomdeeatalot/ChielSamAppHub/releases/download/v1.0.0/ORINZA-v1.0.0.apk')
check('getReleaseAssetUrl prefers literal url', getReleaseAssetUrl('app_orinza', '1.0.0', EXAMPLE_ASSET) === EXAMPLE_ASSET)
check('unknown app has no asset url', getReleaseAssetUrl('app_nope', '1.0.0', null) === null)

// ORINZA WITH a real url WOULD be treated as downloadable.
orinzaRelease.artifactUrl = EXAMPLE_ASSET
orinzaRelease.artifactName = 'ORINZA-v1.0.0.apk'
const downloadable = getArtifactAvailability(getCurrentRelease(orinza.id))
check('real url makes it downloadable', downloadable.downloadable === true)
check('downloadable exposes the url', downloadable.url === EXAMPLE_ASSET)
check('downloadable exposes the file name', downloadable.fileName === 'ORINZA-v1.0.0.apk')
check('downloadable has no blocking issues', downloadable.issues.length === 0)
check('getAppReleaseMeta reports downloadable', getAppReleaseMeta(orinza.id).isDownloadable === true)

// Incomplete metadata must still block the download.
orinzaRelease.artifactName = null
check('missing file name blocks download', getArtifactAvailability(getCurrentRelease(orinza.id)).downloadable === false)
orinzaRelease.artifactName = 'ORINZA-v1.0.0.apk'
orinzaRelease.status = RELEASE_STATUS.DRAFT
const draftArtifact = getArtifactAvailability(orinzaRelease)
check('unpublished release blocks download', draftArtifact.downloadable === false)
check('unpublished reports not-published', draftArtifact.issues.includes('not-published'))
orinzaRelease.status = RELEASE_STATUS.CURRENT
orinzaRelease.artifactType = null
check('missing artifact type blocks download', getArtifactAvailability(getCurrentRelease(orinza.id)).downloadable === false)
orinzaRelease.artifactType = ARTIFACT_TYPES.APK
orinzaRelease.artifactSizeMb = null
const sizeOnly = getArtifactAvailability(getCurrentRelease(orinza.id))
check('unknown size warns but does not block', sizeOnly.downloadable === true && sizeOnly.warnings.includes('unknown-size'))
orinzaRelease.artifactSizeMb = 12.5
check('size label formats mb', formatFileSize(12.5) === '12.5 MB')
check('size label formats gb', formatFileSize(2048) === '2.00 GB')
check('missing size label is null', formatFileSize(null) === null)

// A published newer release is downloadable and drives the update path.
// This test uses a literal artifactUrl override so it does not depend on the
// distribution config, which is pinned to v1.0.0.
const newerRelease = {
  ...orinzaRelease,
  version: '1.1.0',
  versionCode: 2,
  releaseDate: '2026-10-01',
  status: RELEASE_STATUS.CURRENT,
  artifactUrl: EXAMPLE_ASSET,
  artifactName: 'ORINZA-v1.0.0.apk',
}
orinzaRelease.status = RELEASE_STATUS.SUPERSEDED
RELEASES.push(newerRelease)

const twoReleaseHistory = getReleasesForApp(orinza.id)
check('history keeps both releases', twoReleaseHistory.length === 2)
check('history is newest first', twoReleaseHistory[0].version === '1.1.0')
check('older release stays historical', twoReleaseHistory[1].status === RELEASE_STATUS.SUPERSEDED)
check('current release is the newest', getCurrentRelease(orinza.id).version === '1.1.0')
check('latest release is the newest', getLatestRelease(orinza.id).version === '1.1.0')

const upgrade = getUpdateAvailability(orinza.id, '1.0.0')
check('older visitor sees an update', upgrade.updateAvailable === true)
check('update is ready with a real artifact', upgrade.updateReady === true)
check('update url is the real asset', upgrade.updateUrl === EXAMPLE_ASSET)
check('update exposes the new version code', upgrade.latestVersionCode === 2)

orinzaRelease.artifactUrl = null
newerRelease.artifactUrl = null
const pendingUpdate = getUpdateAvailability(orinza.id, '1.0.0')
check('update available but not ready without artifact', pendingUpdate.updateAvailable === true && pendingUpdate.updateReady === false)
check('pending update has no url', pendingUpdate.updateUrl === null)
check('pending update explains why', pendingUpdate.reason.startsWith('published-release-pending-artifact'))

RELEASES.splice(RELEASES.indexOf(newerRelease), 1)
orinzaRelease.status = RELEASE_STATUS.CURRENT
orinzaRelease.artifactUrl = null
orinzaRelease.artifactName = null
orinzaRelease.artifactSizeMb = null

const restored = getArtifactAvailability(getCurrentRelease(orinza.id))
check('state restored after multi-release test', restored.downloadable === true)
check('single release again', getReleasesForApp(orinza.id).length === 1)

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

check('no fake apk link in html', !/\.apk["']/i.test(allHtml.replace(/https:\/\/example\.com[^"' ]*/g, '').replace(/https:\/\/github\.com\/chukwuazagomdeeatalot\/ChielSamAppHub\/releases\/download\/v1\.0\.0\/ORINZA-v1\.0\.0\.apk/g, '')))
check('no invented http download urls', !/href="https?:\/\/(?!example\.com|github\.com\/chukwuazagomdeeatalot\/ChielSamAppHub\/releases\/download\/v1\.0\.0\/ORINZA-v1\.0\.0\.apk)[^"]*(\.apk|\.aab|download)/i.test(allHtml))
check('release artifact urls stay null - distribution builds the url', getAllReleaseRecords().every((r) => r.artifactUrl === null))
check('app download urls stay null - distribution builds the url', getAllApps().every((a) => a.download.url === null))
check('ORINZA status available', orinza.status === 'Available')

console.log('')
console.log(`${checks} checks run`)
if (failures > 0) {
  console.log(`${failures} FAILURE(S)`)
  process.exit(1)
}
console.log('ALL CHECKS PASSED')
