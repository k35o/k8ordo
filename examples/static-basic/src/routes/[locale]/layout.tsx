import type { ReactNode } from 'react';

import { locales } from '../../i18n';

// [locale] の下のページすべてのロケールを、ここで決める。ページではなく
// レイアウトに置くのは、殻（fallback.tsx）の描画で走るのがレイアウトの
// スキーマだけだから。/fr/… はこのスキーマが拒み、どのページも答えない
export const { paramsSchema } = locales;

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children;
}
