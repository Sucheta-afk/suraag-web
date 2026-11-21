/**
 * generate-og-stubs.cjs
 * ---------------------
 * Reads src/data/mockData.js and writes a lightweight HTML stub to
 * public/<artist-slug>.html for every musician.
 *
 * Each stub:
 *  1. Has full Open Graph / Twitter Card meta so WhatsApp, Telegram,
 *     Discord, Instagram Stories etc. show the Suraag banner image.
 *  2. Immediately 301-redirects human visitors back to the SPA via
 *     both <meta http-equiv="refresh"> and a small inline script.
 *
 * Run:  node scripts/generate-og-stubs.cjs
 * Or add to package.json scripts: "og:stubs": "node scripts/generate-og-stubs.cjs"
 */

const fs   = require('fs');
const path = require('path');

// ── inline the slug logic (mirrors src/utils/artistSlug.js) ──────────────────
function artistSlug(artist) {
  return (artist.stageName || artist.name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── load musicians from the mock data file ───────────────────────────────────
// We do a quick text-extraction rather than fully parsing ESM
const dataPath  = path.resolve(__dirname, '../src/data/mockData.js');
const dataText  = fs.readFileSync(dataPath, 'utf8');

// Evaluate via a tiny CommonJS shim
const shimText = dataText
  .replace(/^export const /gm, 'const ')   // strip ES module exports
  .replace(/^export default /gm, 'module.exports.default = '); // just in case

let INITIAL_MUSICIANS = [];
try {
  const mod = new Function('module', 'exports', `${shimText}\nmodule.exports.INITIAL_MUSICIANS = INITIAL_MUSICIANS;`);
  const fakeModule = { exports: {} };
  mod(fakeModule, fakeModule.exports);
  INITIAL_MUSICIANS = fakeModule.exports.INITIAL_MUSICIANS || [];
} catch (e) {
  console.error('Could not parse mockData.js:', e.message);
  process.exit(1);
}

if (!INITIAL_MUSICIANS.length) {
  console.error('No musicians found in mockData.js — aborting.');
  process.exit(1);
}

// ── config ───────────────────────────────────────────────────────────────────
const BASE_URL    = 'https://suraag.in';
const BANNER_URL  = `${BASE_URL}/suraag-banner.jpg`;
const PUBLIC_DIR  = path.resolve(__dirname, '../public');

// ── HTML template ─────────────────────────────────────────────────────────────
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildStub(artist) {
  const slug        = artistSlug(artist);
  const name        = escapeHtml(artist.stageName || artist.name);
  const role        = escapeHtml(artist.primaryRole || 'Artiste');
  const location    = escapeHtml((artist.location || '').split(',')[0].trim());
  const headline    = escapeHtml(artist.headline || `${name} — ${role} on Suraag`);
  const description = escapeHtml(
    artist.musicalIdentity || artist.bio?.[0] || artist.bio ||
    `Discover ${name}'s recordings, lineage, and artistry on Suraag.`
  );
  const profileUrl  = `${BASE_URL}/${slug}`;
  const title       = `${name} — ${role}${location ? ' | ' + location : ''} | Suraag`;

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${profileUrl}" />

  <!-- Open Graph — WhatsApp · Telegram · Discord · LinkedIn · Facebook -->
  <meta property="og:type"              content="profile" />
  <meta property="og:site_name"         content="SURAAG" />
  <meta property="og:url"               content="${profileUrl}" />
  <meta property="og:locale"            content="en_IN" />
  <meta property="og:title"             content="${title}" />
  <meta property="og:description"       content="${description}" />
  <meta property="og:image"             content="${BANNER_URL}" />
  <meta property="og:image:secure_url"  content="${BANNER_URL}" />
  <meta property="og:image:type"        content="image/jpeg" />
  <meta property="og:image:width"       content="1024" />
  <meta property="og:image:height"      content="682" />
  <meta property="og:image:alt"         content="Suraag — India's Music Community" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card"             content="summary_large_image" />
  <meta name="twitter:site"             content="@suraag_in" />
  <meta name="twitter:title"            content="${title}" />
  <meta name="twitter:description"      content="${description}" />
  <meta name="twitter:image"            content="${BANNER_URL}" />
  <meta name="twitter:image:alt"        content="Suraag — India's Music Community" />

  <!-- WhatsApp prefers a 1.91:1 image; ours (1024×682 ≈ 1.5:1) is accepted.
       For best WhatsApp previews the image must be on a publicly accessible URL. -->

  <!-- Redirect real users to the React SPA immediately -->
  <meta http-equiv="refresh" content="0; url=/" />
  <script>window.location.replace('/');</script>
  <style>body{margin:0;background:#f3ead9;display:grid;min-height:100vh;place-items:center;font-family:Georgia,serif;color:#2a1a12;}a{color:#a9502f;}</style>
</head>
<body>
  <p>Opening <strong>${name}</strong>'s Suraag profile…<br>
  <a href="/">Click here if you are not redirected</a></p>
</body>
</html>`;
}

// ── generate & write ──────────────────────────────────────────────────────────
let count = 0;
for (const artist of INITIAL_MUSICIANS) {
  const slug = artistSlug(artist);
  if (!slug) continue;
  const outPath = path.join(PUBLIC_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, buildStub(artist), 'utf8');
  console.log(`  ✅  ${slug}.html  ← ${artist.stageName || artist.name}`);
  count++;
}

console.log(`\n🎵  Generated ${count} artist OG stub file(s) in public/`);
