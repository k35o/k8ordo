import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nLocales;

const DEFINE = `import { defineLocales } from '@k8ordo/i18n';
import type { LocaleOf } from '@k8ordo/i18n';

export const locales = defineLocales(
  {
    ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
    'en-US': { timeZone: 'America/New_York', dir: 'ltr' },
    ar: { timeZone: 'Africa/Cairo', dir: 'rtl' },
  },
  { default: 'en-US' },
);

export type Locale = LocaleOf<typeof locales>;

declare module '@k8ordo/i18n' {
  interface Register {
    locale: Locale;
  }
}`;

const DEFAULT = `locales.all; // ['ja', 'en-US', 'ar']
locales.default; // 'en-US'`;

const DIR = `locales.definitions.ar;
// { timeZone: 'Africa/Cairo', dir: 'rtl' }`;

export default function I18nLocalesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/locales">
      <DocSection
        description={t.defineDescription}
        id="define"
        title={t.defineTitle}
      >
        <CodeBlock
          code={DEFINE}
          lang="ts"
          marks={{ 6: 'highlight', 7: 'highlight', 8: 'highlight' }}
          title="src/i18n.ts"
        />
        <p>
          <Rich>{t.defineTag()}</Rich>
        </p>
        <p>
          <Rich>{t.defineLocaleType()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.definePitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.defaultDescription}
        id="default"
        title={t.defaultTitle}
      >
        <CodeBlock code={DEFAULT} lang="ts" />
        <p>
          <Rich>{t.defaultWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.defaultType()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.timeZoneDescription}
        id="time-zone"
        title={t.timeZoneTitle}
      >
        <p>
          <Rich>{t.timeZoneWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.timeZoneChoose()}</Rich>
        </p>
        <p>
          <Rich>{t.timeZoneMore()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.dirDescription} id="dir" title={t.dirTitle}>
        <CodeBlock code={DIR} lang="ts" />
        <p>
          <Rich>{t.dirWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.dirHtml()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.errorsDescription}
        id="errors"
        title={t.errorsTitle}
      >
        <ul>
          {t.errorsList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.errorsTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.membersDescription}
        id="members"
        title={t.membersTitle}
      >
        <ul>
          {t.membersList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.membersMore()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
