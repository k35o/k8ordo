import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeStorage;

type Cell = { code: string } | { text: Message };

const ROW_SHAPES: ReadonlyArray<{ id: string; when: Cell; row: Cell }> = [
  { id: 'never', when: { text: t.rows.never }, row: { text: t.rows.noRow } },
  {
    id: 'dark',
    when: { code: "setPreference('dark')" },
    row: { code: '{"preference":"dark"}' },
  },
  {
    id: 'light',
    when: { code: "setPreference('light')" },
    row: { code: '{"preference":"light"}' },
  },
  {
    id: 'system',
    when: { code: "setPreference('system')" },
    row: { code: '{}' },
  },
];

const DEFINITION = `import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const colorSchemeState = defineLocalState(
  'color-scheme',
  z.object({ preference: z.optional(z.enum(['light', 'dark'])) }),
);`;

const READ_ELSEWHERE = `// src/components/stored-preference.tsx
'use client';

import { colorSchemeState } from '@k8ordo/color-scheme';
import { useAppState } from '@k8ordo/state';

export function StoredPreference() {
  const [{ preference }] = useAppState(colorSchemeState);

  return <output>{preference ?? 'system'}</output>;
}`;

const BESIDE = `// src/theme/state.ts
import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const writingModeState = defineLocalState(
  'writing-mode',
  z.object({ mode: z.optional(z.enum(['horizontal', 'vertical'])) }),
);`;

function CellContent({ cell }: { cell: Cell }) {
  return 'code' in cell ? <Code>{cell.code}</Code> : <Rich>{cell.text()}</Rich>;
}

export default function ColorSchemeStoragePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/storage">
      <DocSection
        id="definition"
        description={t.definition.description}
        title={t.definition.title}
      >
        <CodeBlock code={DEFINITION} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.definition.key()}</Rich>
        </p>
      </DocSection>

      <DocSection
        id="rows"
        description={t.rows.description}
        title={t.rows.title}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  <Rich>{t.rows.columnWhen()}</Rich>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Rich>{t.rows.columnRow()}</Rich>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {ROW_SHAPES.map((shape) => (
                <tr className="border-border-mute border-b" key={shape.id}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <CellContent cell={shape.when} />
                  </td>
                  <td className="py-3">
                    <CellContent cell={shape.row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.rows.systemRow()}</Rich>
        </p>
      </DocSection>

      <DocSection
        id="read"
        description={t.read.description}
        title={t.read.title}
      >
        <CodeBlock code={READ_ELSEWHERE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.read.caveat()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.read.inlineRead()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/reading">
            <Rich>{t.read.inlineReadLink()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        id="tabs"
        description={t.tabs.description}
        title={t.tabs.title}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.tabs.sameTab()}</Rich>
        </p>
      </DocSection>

      <DocSection
        id="beside"
        description={t.beside.description}
        title={t.beside.title}
      >
        <CodeBlock code={BESIDE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.beside.collision()}</Rich>
        </p>
        <p className="text-sm">
          <LocaleAnchor path="/:locale/state/places">
            <Rich>{t.beside.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
