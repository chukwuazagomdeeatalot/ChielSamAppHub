/**
 * Binary distribution settings for the hub.
 *
 * APKs are NOT stored in this repository. Large release binaries are attached to
 * a GitHub Release, and this file records WHERE each release asset lives so the
 * site can link to it.
 *
 * ---------------------------------------------------------------------------
 * THIS IS THE SINGLE PLACE TO EDIT WHEN A REAL RELEASE IS PUBLISHED.
 * ---------------------------------------------------------------------------
 *
 * To make a download live, publish a GitHub Release in the repository below,
 * attach the signed APK to it, then fill in the `tag` and `asset` for that
 * version here. Nothing else needs to change: validation, the download button
 * and the update status all read the result of `getReleaseAssetUrl`.
 *
 * Until `tag` and `asset` are both real values, `getReleaseAssetUrl` returns
 * null and the site keeps showing a disabled "coming soon" button. There is no
 * way for a link to appear before a file genuinely exists.
 */

export const DISTRIBUTION = {
  /** Where release binaries are hosted. */
  provider: 'github-releases',

  /** The repository that hosts the Releases. */
  repository: {
    owner: 'chukwuazagomdeeatalot',
    name: 'ChielSamAppHub',
  },

  /**
   * Release assets, keyed by app id and then by version.
   *
   *   tag    the GitHub Release tag, e.g. 'v1.0.0'
   *   asset  the name of the uploaded file, e.g. 'ORINZA-v1.0.0.apk'
   *
   * Both are null right now because no GitHub Release has been published yet.
   * A null value means "no file hosted", never "link coming soon".
   */
  assets: {
    app_orinza: {
      '1.0.0': {
        tag: null,
        asset: null,
      },
    },
  },
}

function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Builds the download URL for a published GitHub Release asset.
 *
 * Returns null when any part is missing, so a partial configuration can never
 * produce a half-working link. `tag` and `asset` are encoded, which keeps
 * spaces or special characters in a file name from breaking the URL.
 */
export function buildReleaseAssetUrl({ tag, asset } = {}) {
  if (!isFilled(tag) || !isFilled(asset)) return null

  const { owner, name } = DISTRIBUTION.repository

  if (!isFilled(owner) || !isFilled(name)) return null

  const base = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`

  return `${base}/releases/download/${encodeURIComponent(tag.trim())}/${encodeURIComponent(
    asset.trim(),
  )}`
}

/** The recorded asset location for one version, or null if never configured. */
export function getAssetLocation(appId, version) {
  return DISTRIBUTION.assets?.[appId]?.[version] || null
}

/**
 * The real download URL for a release, or null when nothing is hosted yet.
 *
 * A literal `artifactUrl` on the release record wins, so a release can also be
 * hosted somewhere other than GitHub Releases without touching this file.
 */
export function getReleaseAssetUrl(appId, version, artifactUrl) {
  if (isFilled(artifactUrl)) return artifactUrl

  const location = getAssetLocation(appId, version)

  return location ? buildReleaseAssetUrl(location) : null
}

/** True once at least one real asset location has been configured. */
export function hasConfiguredAssets() {
  return Object.values(DISTRIBUTION.assets || {}).some((versions) =>
    Object.values(versions || {}).some((location) => isFilled(location?.tag) && isFilled(location?.asset)),
  )
}