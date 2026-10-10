/**
 * A value as a JavaScript literal, the way a reader would write it in
 * source: `{ a: 0, b: 'x' }`, `['A-102']`, `{}`. `JSON.stringify` quotes
 * every key and doubles every quote, which reads as wire format, not code.
 */
export const jsLiteral = (value: unknown): string => {
  if (typeof value === 'string') return `'${value.replaceAll("'", "\\'")}'`;
  if (Array.isArray(value)) {
    return value.length === 0
      ? '[]'
      : `[${value.map((item) => jsLiteral(item)).join(', ')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    return entries.length === 0
      ? '{}'
      : `{ ${entries.map(([key, item]) => `${key}: ${jsLiteral(item)}`).join(', ')} }`;
  }
  return String(value);
};
