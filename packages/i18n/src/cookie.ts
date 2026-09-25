/**
 * The value of one cookie in a `Cookie` header, or `null` when the header or
 * the cookie is missing. The first cookie of that name wins — a browser sends
 * the one with the most specific path first — and a value in double quotes
 * (RFC 6265 allows them) comes back without them. Values are not
 * percent-decoded: a locale tag needs no encoding.
 */
export const readCookie = (
  header: string | null,
  name: string,
): string | null => {
  if (header === null) return null;
  for (const pair of header.split(';')) {
    const separator = pair.indexOf('=');
    if (separator === -1 || pair.slice(0, separator).trim() !== name) continue;
    const value = pair.slice(separator + 1).trim();
    return value.length >= 2 && value.startsWith('"') && value.endsWith('"')
      ? value.slice(1, -1)
      : value;
  }
  return null;
};
