import type { Message } from '@k8ordo/i18n';
import { Code, Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { NegotiationDemo } from './_parts/negotiation-demo';

const s = m.i18nLocales;

const DEFINE = `// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales(
  {
    'en-US': { timeZone: 'America/New_York', dir: 'ltr' },
    'en-GB': { timeZone: 'Europe/London', dir: 'ltr' },
    ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  },
  { default: 'ja' },
);

export type Locale = LocaleOf<typeof locales>;

declare module '@k8ordo/i18n' {
  interface Register {
    locale: Locale;
  }
}`;

const HTML_DIR = `// src/routes/layout.tsx
const locale = locales.delocalize(pathname).locale ?? locales.default;

<html dir={locales.definitions[locale].dir} lang={locale}>`;

const PREFERRED = `// src/preferred-locale.ts
import { parseAcceptLanguage } from '@k8ordo/i18n';

import { locales } from './i18n';
import type { Locale } from './i18n';

export const fromBrowser = (): Locale => locales.negotiate(navigator.languages);

export const fromHeaders = (headers: Headers): Locale =>
  locales.negotiate(parseAcceptLanguage(headers.get('accept-language')));`;

type Row = { code: string; description: Message };

const THROWS: ReadonlyArray<{ call: string; error: string }> = [
  {
    call: 'defineLocales({})',
    error: 'defineLocales: no locale is defined',
  },
  {
    call: "defineLocales({ ja: …, en: … }, { default: 'fr' })",
    error: 'defineLocales: the default "fr" is not in ["ja","en"]',
  },
  {
    call: "defineLocales({ ja: …, 'not a tag': … })",
    error: 'defineLocales: "not a tag" is not a BCP 47 language tag',
  },
  {
    call: "defineLocales({ ja: { timeZone: 'Asia/Tokio', dir: 'ltr' } })",
    error:
      'defineLocales: the timeZone of "ja", "Asia/Tokio", is not a time zone',
  },
];

const MEMBERS: readonly Row[] = [
  { code: 'all', description: s.members.all },
  { code: 'definitions', description: s.members.definitions },
  { code: 'default', description: s.members.default },
  { code: 'is(value)', description: s.members.is },
  { code: 'negotiate(requested)', description: s.members.negotiate },
  { code: 'localize(pathname, locale)', description: s.members.localize },
  { code: 'delocalize(pathname)', description: s.members.delocalize },
  { code: 'paths(patterns)', description: s.members.paths },
  { code: 'paramsSchema', description: s.members.paramsSchema },
  { code: 'getLocale()', description: s.members.getLocale },
  { code: 'run(locale, fn)', description: s.members.run },
];

const TYPES: readonly Row[] = [
  { code: 'Locales<L, D>', description: s.members.locales },
  { code: 'LocaleOf<typeof locales>', description: s.members.localeOf },
  { code: 'LocaleDefinition', description: s.members.localeDefinition },
  { code: 'LocalesOptions<D>', description: s.members.localesOptions },
  { code: 'Delocalized<L>', description: s.members.delocalized },
  {
    code: 'LocaleParamsSchema<L>',
    description: s.members.localeParamsSchema,
  },
];

const NEGOTIATIONS: ReadonlyArray<{
  requested: string;
  result: string;
  reason: Message;
}> = [
  {
    requested: "['en-GB']",
    result: 'en-GB',
    reason: s.negotiation.reasonExact,
  },
  { requested: "['EN-gb']", result: 'en-GB', reason: s.negotiation.reasonCase },
  {
    requested: "['en-US', 'en-GB']",
    result: 'en',
    reason: s.negotiation.reasonFirstLanguage,
  },
  {
    requested: "['en-US', 'ja']",
    result: 'en',
    reason: s.negotiation.reasonFirstChoice,
  },
  {
    requested: "['ja-JP', 'en']",
    result: 'ja',
    reason: s.negotiation.reasonLanguage,
  },
  {
    requested: "['***', 'en']",
    result: 'en',
    reason: s.negotiation.reasonInvalid,
  },
  { requested: "['fr', 'de']", result: 'ja', reason: s.negotiation.reasonNone },
  { requested: '[]', result: 'ja', reason: s.negotiation.reasonEmpty },
];

const ACCEPT_LANGUAGE: ReadonlyArray<{ header: string; result: string }> = [
  {
    header: "'en-US;q=0.8, ja, en;q=0.9, fr;q=0.8'",
    result: "['ja', 'en', 'en-US', 'fr']",
  },
  { header: "'*;q=0.5, en;q=0, ja'", result: "['ja']" },
  { header: "' en ; foo=bar ; Q=0.5 ,ja'", result: "['ja', 'en']" },
  { header: 'null', result: '[]' },
];

const TH = 'py-3 pr-6 font-medium whitespace-nowrap';
const TR = 'border-border-mute border-b';

function ReferenceTable({
  codeColumn,
  rows,
}: {
  codeColumn: Message;
  rows: readonly Row[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className={TR}>
            <th className={TH}>{codeColumn()}</th>
            <th className={TH}>{s.members.descriptionColumn()}</th>
          </tr>
        </thead>
        <tbody className="text-fg-mute">
          {rows.map((row) => (
            <tr className={TR} key={row.code}>
              <td className="py-3 pr-6 align-top whitespace-nowrap">
                <Code>{row.code}</Code>
              </td>
              <td className="py-3">
                <Rich>{row.description()}</Rich>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function I18nLocalesPage() {
  return (
    <DocPage introduction={s.introduction} path="/:locale/i18n/locales">
      <DocSection description={s.define.description} title={s.define.title}>
        <CodeBlock code={DEFINE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.define.default()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.define.throws()}</Rich>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.define.callColumn()}</th>
                <th className={TH}>{s.define.errorColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {THROWS.map((row) => (
                <tr className={TR} key={row.call}>
                  <td className="py-3 pr-6 align-top">
                    <Code>{row.call}</Code>
                  </td>
                  <td className="py-3">
                    <Code>{row.error}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        description={s.definition.description}
        title={s.definition.title}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.definition.timeZone()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.definition.choosing()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.definition.dir()}</Rich>
        </p>
        <CodeBlock code={HTML_DIR} lang="tsx" />
      </DocSection>

      <DocSection description={s.oneSet.description} title={s.oneSet.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.oneSet.last()}</Rich>
        </p>
      </DocSection>

      <DocSection description={s.members.description} title={s.members.title}>
        <ReferenceTable codeColumn={s.members.memberColumn} rows={MEMBERS} />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.members.more()}</Rich>
        </p>
        <p>
          <LocaleAnchor path="/:locale/i18n/routing">
            {s.members.moreLink()}
          </LocaleAnchor>
        </p>
        <Heading level="h3">{s.members.typesTitle()}</Heading>
        <ReferenceTable codeColumn={s.members.typeColumn} rows={TYPES} />
      </DocSection>

      <DocSection description={s.bcp47.description} title={s.bcp47.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.bcp47.spelling()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={s.negotiation.description}
        title={s.negotiation.title}
      >
        <ol className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-decimal">
            <Rich>{s.negotiation.stepOrder()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.negotiation.stepExact()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.negotiation.stepLanguage()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.negotiation.stepInvalid()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{s.negotiation.stepDefault()}</Rich>
          </li>
        </ol>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.negotiation.caseRule()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.negotiation.languageRule()}</Rich>
          </li>
        </ul>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.negotiation.why()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.negotiation.iterable()}</Rich>
        </p>
        <CodeBlock code={PREFERRED} lang="ts" />
        <Heading level="h3">{s.negotiation.examplesTitle()}</Heading>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{s.negotiation.examplesDescription()}</Rich>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.negotiation.requestedColumn()}</th>
                <th className={TH}>{s.negotiation.resultColumn()}</th>
                <th className={TH}>{s.negotiation.reasonColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {NEGOTIATIONS.map((row) => (
                <tr className={TR} key={row.requested}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{row.requested}</Code>
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{row.result}</Code>
                  </td>
                  <td className="py-3">
                    <Rich>{row.reason()}</Rich>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        description={s.acceptLanguage.description}
        title={s.acceptLanguage.title}
      >
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-disc">
            <Rich>{s.acceptLanguage.weight()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.acceptLanguage.ties()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.acceptLanguage.dropped()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.acceptLanguage.missing()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.acceptLanguage.tolerant()}</Rich>
          </li>
          <li className="list-disc">
            <Rich>{s.acceptLanguage.noValidation()}</Rich>
          </li>
        </ul>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={TR}>
                <th className={TH}>{s.acceptLanguage.headerColumn()}</th>
                <th className={TH}>{s.acceptLanguage.resultColumn()}</th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {ACCEPT_LANGUAGE.map((row) => (
                <tr className={TR} key={row.header}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{`parseAcceptLanguage(${row.header})`}</Code>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <Code>{row.result}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection description={s.demo.description} title={s.demo.title}>
        <NegotiationDemo />
      </DocSection>
    </DocPage>
  );
}
