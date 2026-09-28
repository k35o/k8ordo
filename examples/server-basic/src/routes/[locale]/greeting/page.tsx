import type { PageProps } from '@k8ordo/router';

import { locales } from '../../../i18n';
import { GreetForm } from '../../_parts/greet-form';

// /en/greeting と /ja/greeting だけに答える。受理したロケールは、この
// ページの描画にも、このページに送られた Server Action にも効く
export const { paramsSchema } = locales;

export default function GreetingPage({
  params,
}: PageProps<'/:locale/greeting'>) {
  return (
    <>
      <h1 data-testid="title">greeting ({params.locale})</h1>
      <GreetForm />
    </>
  );
}
