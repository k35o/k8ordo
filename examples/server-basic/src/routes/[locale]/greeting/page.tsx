import type { PageProps } from '@k8ordo/framework';

import { GreetForm } from '../../../components/greet-form';
import { locales } from '../../../i18n';

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
