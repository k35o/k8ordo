import { Code } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { ErrorsGuide } from '../../../../components/framework-guide/errors';
import {
  Cell,
  GuideTable,
  Row,
} from '../../../../components/framework-guide/prose';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const STATUSES = [
  { when: m.serverErrors.statusesTable.page, status: '200' },
  { when: m.serverErrors.statusesTable.thrown, status: '200' },
  { when: m.serverErrors.statusesTable.missing, status: '404' },
  { when: m.serverErrors.statusesTable.redirect, status: '307' },
  { when: m.serverErrors.statusesTable.action, status: '303' },
  { when: m.serverErrors.statusesTable.crossOrigin, status: '403' },
  { when: m.serverErrors.statusesTable.failed, status: '500' },
];

export default function ServerErrorsPage() {
  const t = m.serverErrors;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/errors">
      <ErrorsGuide mode="server" />

      <DocSection description={t.statusesDescription} title={t.statusesTitle}>
        <GuideTable head={[t.statusesTable.when, t.statusesTable.status]}>
          {STATUSES.map((row) => (
            <Row key={row.when()}>
              <Cell>
                <Rich>{row.when()}</Rich>
              </Cell>
              <Cell nowrap>
                <Code>{row.status}</Code>
              </Cell>
            </Row>
          ))}
        </GuideTable>
      </DocSection>
    </DocPage>
  );
}
