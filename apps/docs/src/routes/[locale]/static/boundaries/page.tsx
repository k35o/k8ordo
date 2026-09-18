import { DocPage } from '../../../../components/doc-page';
import { BoundariesGuide } from '../../../../components/framework-guide/boundaries';
import * as m from '../../../../messages';

export default function StaticBoundariesPage() {
  return (
    <DocPage
      introduction={m.staticBoundaries.introduction}
      path="/:locale/static/boundaries"
    >
      <BoundariesGuide mode="static" />
    </DocPage>
  );
}
