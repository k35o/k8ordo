import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  PaginationDisabledPreview,
  PaginationPreview,
} from '../_previews/pagination-previews';

export default function PaginationPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Pagination</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.pagination.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-navigation-pagination--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock code="import { Pagination } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.pagination.disabledTitle" />
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

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable items={propsOf('Pagination')} messagesNote />
      </section>
    </div>
  );
}
