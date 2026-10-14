import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import {
  PaginationDisabledPreview,
  PaginationPreview,
} from '../../../../../demos/ui/components/pagination-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function PaginationPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Pagination" />
      <div className={page.stack}>
        <Heading level="h1">Pagination</Heading>
        <p className={page.lead}>
          <Rich>{m.components.pagination.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-pagination--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { Pagination } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [page, setPage] = useState(1);

<Pagination
  currentPage={page}
  onChange={setPage}
  totalPages={10}
/>`}
          >
            <PaginationPreview />
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.pagination.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Pagination
  currentPage={3}
  disabled
  onChange={() => {}}
  totalPages={10}
/>`}
          >
            <PaginationDisabledPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Pagination')}
          items={propsOf('Pagination')}
          messagesNote
        />
      </section>
    </div>
  );
}
