import { DocPage } from '../../../../components/doc-page';
import { BoundariesGuide } from '../../../../components/framework-guide/boundaries';
import * as m from '../../../../messages';

export default function ServerBoundariesPage() {
  return (
    <DocPage
      introduction={m.serverBoundaries.introduction}
      path="/:locale/server/boundaries"
    >
      <BoundariesGuide mode="server" />
    </DocPage>
  );
}
