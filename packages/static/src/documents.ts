const escapeMarkup = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/**
 * The sitemap protocol's one required element per URL: `<loc>`. The site is
 * taken as given, without a trailing slash, and the pathname as the URL
 * carries it, escaped for XML.
 */
export const sitemap = (site: string, pathnames: readonly string[]): string => {
  const origin = site.endsWith('/') ? site.slice(0, -1) : site;
  const urls = pathnames
    .toSorted()
    .map(
      (pathname) =>
        `  <url><loc>${escapeMarkup(`${origin}${pathname}`)}</loc></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * A redirect as a file: no server will ever send the status, so the page
 * itself has to send the visitor on. `http-equiv="refresh"` is what every
 * browser honours; the link is for the one that does not.
 */
export const redirectPage = (to: string): string => {
  const escaped = escapeMarkup(to);
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escaped}"><link rel="canonical" href="${escaped}"><title>Redirecting</title></head><body><a href="${escaped}">${escaped}</a></body></html>\n`;
};
