'use client';

import { createContext, use } from 'react';

/**
 * What the HTML render of a document is told by once the page's own
 * component has rendered there; `null` everywhere else.
 */
export const PageShownContext = createContext<(() => void) | null>(null);

/**
 * Rendered right after the page's own content, so it renders only once that
 * content has: in the HTML render, that is how the render learns the page is
 * in place before anything is sent. Renders nothing.
 */
export function PageShown(): null {
  use(PageShownContext)?.();
  return null;
}
