import { DocPage } from '../../../../components/doc-page';
import { errorsSections } from '../../../../components/framework-guide/errors';
import * as m from '../../../../messages';

export default function ServerErrorsPage() {
  return (
    <DocPage
      introduction={m.serverErrors.introduction}
      path="/:locale/server/errors"
    >
      {errorsSections('server')}
    </DocPage>
  );
}
