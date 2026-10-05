import { DocPage } from '../../../../components/doc-page';
import { getStartedSections } from '../../../../components/framework-guide/get-started';
import * as m from '../../../../messages';

export default function ServerGetStartedPage() {
  return (
    <DocPage
      introduction={m.serverGetStarted.introduction}
      path="/:locale/server/get-started"
    >
      {getStartedSections('server')}
    </DocPage>
  );
}
