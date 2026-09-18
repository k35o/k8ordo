import { DocPage } from '../../../../components/doc-page';
import { ErrorsGuide } from '../../../../components/framework-guide/errors';
import * as m from '../../../../messages';

export default function StaticErrorsPage() {
  return (
    <DocPage
      introduction={m.staticErrors.introduction}
      path="/:locale/static/errors"
    >
      <ErrorsGuide mode="static" />
    </DocPage>
  );
}
