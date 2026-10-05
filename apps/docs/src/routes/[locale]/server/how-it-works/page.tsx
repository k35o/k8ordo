import { DocPage } from '../../../../components/doc-page';
import { howItWorksSections } from '../../../../components/framework-guide/how-it-works';
import * as m from '../../../../messages';

export default function ServerHowItWorksPage() {
  return (
    <DocPage
      introduction={m.frameworkHowItWorks.introduction}
      path="/:locale/server/how-it-works"
    >
      {howItWorksSections()}
    </DocPage>
  );
}
