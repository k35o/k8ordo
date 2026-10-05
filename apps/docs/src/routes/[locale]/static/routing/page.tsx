import { DocPage } from '../../../../components/doc-page';
import { routingSections } from '../../../../components/framework-guide/routing';
import * as m from '../../../../messages';

export default function StaticRoutingPage() {
  return (
    <DocPage
      introduction={m.staticRouting.introduction}
      path="/:locale/static/routing"
    >
      {routingSections('static')}
    </DocPage>
  );
}
