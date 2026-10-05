import { DocPage } from '../../../../components/doc-page';
import { getStartedSections } from '../../../../components/framework-guide/get-started';
import * as m from '../../../../messages';

export default function StaticGetStartedPage() {
  return (
    <DocPage
      introduction={m.staticGetStarted.introduction}
      path="/:locale/static/get-started"
    >
      {getStartedSections('static')}
    </DocPage>
  );
}
