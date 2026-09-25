import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const s = m.i18nFormatting;

const PUBLISHED_AT = `// src/components/published-at.tsx
import { locales } from '../i18n';

export function PublishedAt({ date }: { date: Date }) {
  return (
    <time dateTime={date.toISOString()}>
      {locales.dateTimeFormat({ dateStyle: 'medium' }).format(date)}
    </time>
  );
}`;

const REFUSED = `// the type refuses it — the locale's time zone is the only one
locales.dateTimeFormat({ dateStyle: 'medium', timeZone: 'UTC' });`;

const CART = `// src/messages/cart.ts
import { message } from '@k8ordo/i18n';

import { locales } from '../i18n';

export const items = message({
  ja: (count: number) => \`\${locales.numberFormat().format(count)} 件\`,
  en: (count) =>
    \`\${locales.numberFormat().format(count)} \${locales.pluralRules().select(count) === 'one' ? 'item' : 'items'}\`,
});

export const updated = message({
  ja: (date: Date) =>
    \`\${locales.dateTimeFormat({ dateStyle: 'long' }).format(date)} 更新\`,
  en: (date) =>
    \`Updated \${locales.dateTimeFormat({ dateStyle: 'long' }).format(date)}\`,
});`;

const MEMBERS: ReadonlyArray<{ code: string; returns: Message }> = [
  {
    code: 'dateTimeFormat(options?)',
    returns: s.members.dateTimeFormat,
  },
  { code: 'numberFormat(options?)', returns: s.members.numberFormat },
  {
    code: 'relativeTimeFormat(options?)',
    returns: s.members.relativeTimeFormat,
  },
  { code: 'pluralRules(options?)', returns: s.members.pluralRules },
  { code: 'listFormat(options?)', returns: s.members.listFormat },
];

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TR = 'border-border-mute border-b';

export default function I18nFormattingPage() {
  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/formatting">
      <DocSection description={s.members.description} title={s.members.title}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.members.memberColumn()}</th>
                <th className={TH}>{s.members.returnsColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {MEMBERS.map((row) => (
                <tr className={TR} key={row.code}>
                  <td className="py-3 pr-6 align-top whitespace-nowrap">
                    <Code>{row.code}</Code>
                  </td>
                  <td className="py-3">
                    <Rich>{row.returns()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.members.itself()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.members.others()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.timeZone.description} title={s.timeZone.title}>
        <CodeBlock code={PUBLISHED_AT} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.timeZone.why()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.timeZone.refused()}</Rich>
        </p>
        <CodeBlock code={REFUSED} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.timeZone.visitor()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.inMessages.description}
        title={s.inMessages.title}
      >
        <CodeBlock code={CART} lang="ts" />
      </DocSection>

      <DocSection description={s.cache.description} title={s.cache.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.cache.key()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
