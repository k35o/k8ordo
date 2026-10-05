import { DocPage } from '../../../../components/doc-page';
import { boundariesSections } from '../../../../components/framework-guide/boundaries';
import * as m from '../../../../messages';

export default function ServerBoundariesPage() {
  return (
    <DocPage
      introduction={m.serverBoundaries.introduction}
      path="/:locale/server/boundaries"
    >
      {boundariesSections('server')}
    </DocPage>
  );
}
