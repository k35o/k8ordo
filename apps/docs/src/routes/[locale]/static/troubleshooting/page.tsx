import { DocPage } from '../../../../components/doc-page';
import { troubleshootingSections } from '../../../../components/framework-guide/troubleshooting';
import * as m from '../../../../messages';

export default function StaticTroubleshootingPage() {
  return (
    <DocPage
      introduction={m.frameworkTroubleshooting.introduction}
      path="/:locale/static/troubleshooting"
    >
      {troubleshootingSections('static')}
    </DocPage>
  );
}
