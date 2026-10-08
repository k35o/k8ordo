import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage } from '../../../../components/doc-page';
import * as m from '../../../../messages';

const t = m.i18nReference;
const FROM = '@k8ordo/i18n';

const DEFINE_EXAMPLE = `export const locales = defineLocales(
  {
    ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
    en: { timeZone: 'America/New_York', dir: 'ltr' },
  },
  { default: 'en' },
);`;

const MESSAGE_EXAMPLE = `export const home = message({ ja: 'ホーム', en: 'Home' });

export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`,
});`;

const PARSE_EXAMPLE = `parseAcceptLanguage('en-US;q=0.8, ja, en;q=0.9');
// ['ja', 'en', 'en-US']`;

export default function I18nReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/reference">
      <ApiEntry
        caveats={t.defineLocalesCaveats}
        from={FROM}
        id="define-locales"
        name="defineLocales"
        params={[
          {
            name: 'definitions',
            type: 'Record<string, LocaleDefinition>',
            description: t.defineLocalesDefinitions,
          },
          {
            name: 'options',
            type: 'LocalesOptions<D>',
            description: t.defineLocalesOptions,
          },
        ]}
        returns={{
          type: 'Locales<L, D>',
          description: t.defineLocalesReturns,
        }}
        signature={`defineLocales(
  definitions: Record<string, LocaleDefinition>,
  options?: LocalesOptions<D>,
): Locales<L, D>`}
        summary={t.defineLocalesSummary}
      >
        <CodeBlock code={DEFINE_EXAMPLE} lang="ts" title="src/i18n.ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.localesCaveats}
        fields={[
          { name: 'all', type: 'readonly L[]', description: t.localesAll },
          {
            name: 'definitions',
            type: 'Readonly<Record<L, LocaleDefinition>>',
            description: t.localesDefinitions,
          },
          { name: 'default', type: 'D', description: t.localesDefault },
          {
            name: 'is',
            type: '(value: unknown) => value is L',
            description: t.localesIs,
          },
          {
            name: 'negotiate',
            type: '(requested) => L',
            description: t.localesNegotiate,
          },
          {
            name: 'negotiateRequest',
            type: '(request, options?) => L',
            description: t.localesNegotiateRequest,
          },
          {
            name: 'localize',
            type: '(pathname, locale) => string',
            description: t.localesLocalize,
          },
          {
            name: 'delocalize',
            type: '(pathname) => Delocalized<L>',
            description: t.localesDelocalize,
          },
          {
            name: 'paths',
            type: '(patterns) => string[]',
            description: t.localesPaths,
          },
          {
            name: 'paramsSchema',
            type: 'LocaleParamsSchema<L>',
            description: t.localesParamsSchema,
          },
          {
            name: 'getLocale',
            type: '() => L',
            description: t.localesGetLocale,
          },
          {
            name: 'run',
            type: '(locale, fn) => T',
            description: t.localesRun,
          },
          {
            name: 'dateTimeFormat …',
            type: 'IntlFormats',
            description: t.localesFormats,
          },
        ]}
        from={FROM}
        id="locales"
        name="Locales"
        signature={`type Locales<L extends string, D extends L> =
  IntlFormats & {
    all: readonly L[];
    definitions: Readonly<Record<L, LocaleDefinition>>;
    default: D;
    is: (value: unknown) => value is L;
    negotiate: (requested: Iterable<string>) => L;
    negotiateRequest: (
      request: Request,
      options?: NegotiateRequestOptions,
    ) => L;
    localize: (pathname: string, locale: L) => string;
    delocalize: (pathname: string) => Delocalized<L>;
    paths: (patterns: readonly string[]) => string[];
    paramsSchema: LocaleParamsSchema<L>;
    getLocale: () => L;
    run: <T>(locale: L, fn: () => T) => T;
  };`}
        summary={t.localesSummary}
      />

      <ApiEntry
        caveats={t.intlFormatsCaveats}
        fields={[
          {
            name: 'dateTimeFormat',
            type: '(options?) => Intl.DateTimeFormat',
            description: t.intlFormatsDateTime,
          },
          {
            name: 'numberFormat',
            type: '(options?) => Intl.NumberFormat',
            description: t.intlFormatsNumber,
          },
          {
            name: 'relativeTimeFormat',
            type: '(options?) => Intl.RelativeTimeFormat',
            description: t.intlFormatsRelativeTime,
          },
          {
            name: 'pluralRules',
            type: '(options?) => Intl.PluralRules',
            description: t.intlFormatsPlural,
          },
          {
            name: 'listFormat',
            type: '(options?) => Intl.ListFormat',
            description: t.intlFormatsList,
          },
        ]}
        from={FROM}
        id="intl-formats"
        name="IntlFormats"
        signature={`type IntlFormats = {
  dateTimeFormat: (
    options?: LocaleDateTimeFormatOptions,
  ) => Intl.DateTimeFormat;
  numberFormat: (
    options?: Intl.NumberFormatOptions,
  ) => Intl.NumberFormat;
  relativeTimeFormat: (
    options?: Intl.RelativeTimeFormatOptions,
  ) => Intl.RelativeTimeFormat;
  pluralRules: (
    options?: Intl.PluralRulesOptions,
  ) => Intl.PluralRules;
  listFormat: (options?: Intl.ListFormatOptions) => Intl.ListFormat;
};`}
        summary={t.intlFormatsSummary}
      />

      <ApiEntry
        caveats={t.messageCaveats}
        from={FROM}
        id="message"
        name="message"
        params={[
          {
            name: 'variants',
            type: 'Variants<string> | Variants<(...args: A) => string>',
            description: t.messageVariants,
          },
        ]}
        returns={{ type: 'Message<A>', description: t.messageReturns }}
        signature={`function message(variants: Variants<string>): Message;
function message<A extends readonly unknown[]>(
  variants: Variants<(...args: A) => string>,
): Message<A>;`}
        summary={t.messageSummary}
      >
        <CodeBlock
          code={MESSAGE_EXAMPLE}
          lang="ts"
          title="src/messages/nav.ts"
        />
      </ApiEntry>

      <ApiEntry
        caveats={t.messageTypeCaveats}
        from={FROM}
        id="message-type"
        name="Message"
        signature={`type Message<A extends readonly unknown[] = []> = (
  ...args: A
) => string;`}
        summary={t.messageTypeSummary}
      />

      <ApiEntry
        caveats={t.parseCaveats}
        from={FROM}
        id="parse-accept-language"
        name="parseAcceptLanguage"
        params={[
          {
            name: 'header',
            type: 'string | null',
            description: t.parseHeader,
          },
        ]}
        returns={{ type: 'string[]', description: t.parseReturns }}
        signature="parseAcceptLanguage(header: string | null): string[]"
        summary={t.parseSummary}
      >
        <CodeBlock code={PARSE_EXAMPLE} lang="ts" />
      </ApiEntry>

      <ApiEntry
        caveats={t.currentCaveats}
        from={FROM}
        id="current-locale"
        name="currentLocale"
        returns={{
          type: 'RegisteredLocale | null',
          description: t.currentReturns,
        }}
        signature="currentLocale(): RegisteredLocale | null"
        summary={t.currentSummary}
      />

      <ApiEntry
        caveats={t.registerCaveats}
        from={FROM}
        id="register"
        name="Register"
        signature={`declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}`}
        summary={t.registerSummary}
      />

      <ApiEntry
        from={FROM}
        id="registered-locale"
        name="RegisteredLocale"
        signature={`type RegisteredLocale = Register extends {
  locale: infer L extends string;
}
  ? L
  : string;`}
        summary={t.registeredLocaleSummary}
      />

      <ApiEntry
        caveats={t.variantsCaveats}
        from={FROM}
        id="variants"
        name="Variants"
        signature="type Variants<V> = Readonly<Record<RegisteredLocale, V>>;"
        summary={t.variantsSummary}
      />

      <ApiEntry
        from={FROM}
        id="locale-of"
        name="LocaleOf"
        signature={`type LocaleOf<Ls> =
  Ls extends Locales<infer L, infer _D> ? L : never;`}
        summary={t.localeOfSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'timeZone',
            type: 'string',
            description: t.localeDefinitionTimeZone,
          },
          {
            name: 'dir',
            type: "'ltr' | 'rtl'",
            description: t.localeDefinitionDir,
          },
        ]}
        from={FROM}
        id="locale-definition"
        name="LocaleDefinition"
        signature={`type LocaleDefinition = {
  timeZone: string;
  dir: 'ltr' | 'rtl';
};`}
        summary={t.localeDefinitionSummary}
      />

      <ApiEntry
        fields={[
          { name: 'default', type: 'D', description: t.localesOptionsDefault },
        ]}
        from={FROM}
        id="locales-options"
        name="LocalesOptions"
        signature="type LocalesOptions<D extends string> = { default?: D };"
        summary={t.localesOptionsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'cookie',
            type: 'string',
            description: t.negotiateOptionsCookie,
          },
        ]}
        from={FROM}
        id="negotiate-request-options"
        name="NegotiateRequestOptions"
        signature="type NegotiateRequestOptions = { cookie?: string };"
        summary={t.negotiateOptionsSummary}
      />

      <ApiEntry
        fields={[
          {
            name: 'locale',
            type: 'L | null',
            description: t.delocalizedLocale,
          },
          {
            name: 'pathname',
            type: 'string',
            description: t.delocalizedPathname,
          },
        ]}
        from={FROM}
        id="delocalized"
        name="Delocalized"
        signature={`type Delocalized<L extends string> = {
  locale: L | null;
  pathname: string;
};`}
        summary={t.delocalizedSummary}
      />

      <ApiEntry
        caveats={t.paramsSchemaCaveats}
        from={FROM}
        id="locale-params-schema"
        name="LocaleParamsSchema"
        signature={`type LocaleParamsSchema<L extends string> = {
  '~standard': {
    version: 1;
    vendor: '@k8ordo/i18n';
    validate: (value: unknown) =>
      | { value: { locale: L } }
      | { issues: { message: string; path: ['locale'] }[] };
  };
};`}
        summary={t.paramsSchemaSummary}
      />

      <ApiEntry
        caveats={t.dateTimeOptionsCaveats}
        from={FROM}
        id="locale-date-time-format-options"
        name="LocaleDateTimeFormatOptions"
        signature={`type LocaleDateTimeFormatOptions = Intl.DateTimeFormatOptions & {
  timeZone?: never;
};`}
        summary={t.dateTimeOptionsSummary}
      />
    </DocPage>
  );
}
