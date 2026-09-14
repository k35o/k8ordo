/**
 * The tags of an `Accept-Language` header, most preferred first: `q` weights
 * decide the order (a tag without one weighs 1), ties keep the header's
 * order, `q=0` and the `*` wildcard are dropped — the wildcard says "anything",
 * which is what the default locale already means. Feed the result to
 * `locales.negotiate`; a missing header (`null`) is an empty list.
 */
export const parseAcceptLanguage = (header: string | null): string[] => {
  if (header === null || header.trim() === '') return [];
  const weighed = header.split(',').flatMap((part, index) => {
    const [rawTag = '', ...params] = part.split(';');
    const tag = rawTag.trim();
    if (tag === '' || tag === '*') return [];
    let quality = 1;
    for (const param of params) {
      const [name, value] = param.split('=');
      if (name?.trim().toLowerCase() === 'q' && value !== undefined) {
        const parsed = Number(value.trim());
        if (!Number.isNaN(parsed)) quality = parsed;
      }
    }
    return quality > 0 ? [{ tag, quality, index }] : [];
  });
  return weighed
    .toSorted((a, b) => b.quality - a.quality || a.index - b.index)
    .map((entry) => entry.tag);
};
