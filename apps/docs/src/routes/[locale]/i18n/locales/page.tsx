import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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

const DEFAULT = `locales.default; // 'en-US'`;

const DIR = `locales.definitions.ar;
// { timeZone: 'Africa/Cairo', dir: 'rtl' }`;

const ERROR = `defineLocales({ ja: { timeZone: 'Asia/Tokio', dir: 'ltr' } });
// TypeError: defineLocales: the timeZone of "ja", "Asia/Tokio", is not a time zone`;

export default function I18nLocalesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/locales">
      <DocSection id="define" title={t.defineTitle}>
        <CodeBlock
          callouts={{
            10: t.defineDefaultCallout(),
            17: t.defineRegisterCallout(),
          }}
          code={DEFINE}
          lang="ts"
          marks={{ 6: 'highlight', 7: 'highlight', 8: 'highlight' }}
          title="src/i18n.ts"
        />
        <p>
          <Rich>{t.defineObject()}</Rich>
        </p>
        <p>
          <Rich>{t.defineType()}</Rich>
        </p>
        <p>
          <Rich>{t.defineRegister()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.definePitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="default" title={t.defaultTitle}>
        <CodeBlock code={DEFAULT} lang="ts" />
        <p>
          <Rich>{t.defaultChoose()}</Rich>
        </p>
        <p>
          <Rich>{t.defaultUsedLead()}</Rich>
        </p>
        <ul>
          {t.defaultUsedList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="time-zone" title={t.timeZoneTitle}>
        <p>
          <Rich>{t.timeZoneWhat()}</Rich>
          <LocaleAnchor path="/:locale/i18n/formatting">
            {m.i18n.navFormatting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.timeZoneWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.timeZoneChoose()}</Rich>
        </p>
      </DocSection>

      <DocSection id="dir" title={t.dirTitle}>
        <CodeBlock code={DIR} lang="ts" />
        <p>
          <Rich>{t.dirWhat()}</Rich>
        </p>
        <p>
          <Rich>{t.dirHtml()}</Rich>
          <LocaleAnchor path="/:locale/i18n/routing">
            {m.i18n.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="errors" title={t.errorsTitle}>
        <CodeBlock code={ERROR} lang="ts" />
        <p>
          <Rich>{t.errorsWhen()}</Rich>
        </p>
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

      <DocSection id="members" title={t.membersTitle}>
        <p>
          <Rich>{t.membersLead()}</Rich>
        </p>
        <ul>
          {[
            t.membersAll,
            t.membersDefinitions,
            t.membersDefault,
            t.membersIs,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
          <li>
            <Rich>{t.membersNegotiate()}</Rich>
            <LocaleAnchor path="/:locale/i18n/negotiate">
              {m.i18n.navNegotiate()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
          <li>
            <Rich>{t.membersLocalize()}</Rich>
            <LocaleAnchor path="/:locale/i18n/switch">
              {m.i18n.navSwitch()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
          <li>
            <Rich>{t.membersParams()}</Rich>
            <LocaleAnchor path="/:locale/i18n/routing">
              {m.i18n.navRouting()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
          <li>
            <Rich>{t.membersPaths()}</Rich>
            <LocaleAnchor path="/:locale/framework/params">
              {m.framework.navParams()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
          <li>
            <Rich>{t.membersFormat()}</Rich>
            <LocaleAnchor path="/:locale/i18n/formatting">
              {m.i18n.navFormatting()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </li>
        </ul>
        <p>
          <Rich>{t.membersMore()}</Rich>
          <LocaleAnchor path="/:locale/i18n/reference">
            {m.i18n.navReference()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
