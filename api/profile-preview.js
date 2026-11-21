import { INITIAL_MUSICIANS } from '../src/data/mockData.js';

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function handler(request, response) {
  const url = new URL(request.url, `https://${request.headers.host || 'suraag.in'}`);
  const slug = url.searchParams.get('slug') || '';
  const artist = INITIAL_MUSICIANS.find((item) => {
    const stageName = item.stageName || item.name || '';
    const itemSlug = stageName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return itemSlug === slug;
  });

  const origin = `${url.protocol}//${url.host}`;
  const profileUrl = `${origin}/${encodeURIComponent(slug)}`;
  const bannerUrl = `${origin}/suraag-banner.jpg`;
  const name = artist ? (artist.stageName || artist.name) : 'Suraag Artist';
  const role = artist?.primaryRole || 'Musician';
  const description = artist?.artistStatement || artist?.musicalIdentity || artist?.headline ||
    `Discover ${name}'s artistry on Suraag.`;
  const title = `${name} — ${role} on Suraag`;

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  response.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="SURAAG" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(profileUrl)}" />
    <meta property="og:image" content="${escapeHtml(bannerUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(bannerUrl)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1024" />
    <meta property="og:image:height" content="682" />
    <meta property="og:image:alt" content="Suraag.in Musical Banner" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(bannerUrl)}" />
  </head>
  <body></body>
</html>`);
}
