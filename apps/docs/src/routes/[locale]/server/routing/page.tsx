import { DocPage } from '../../../../components/doc-page';
import { RoutingGuide } from '../../../../components/framework-guide/routing';
import * as m from '../../../../messages';

export default function ServerRoutingPage() {
  return (
    <DocPage
      introduction={m.serverRouting.introduction}
      path="/:locale/server/routing"
    >
      <RoutingGuide mode="server" />
    </DocPage>
  );
}
