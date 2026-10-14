
import { CodeBlock } from '../../../../components/code-block';
import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { TimeZoneDemo } from '../../../../demos/i18n/formatting/time-zone-demo';
import * as m from '../../../../messages';

const t = m.i18nFormatting;

const PRICE = `import { locales } from '../i18n';

export function Price({ amount }: { amount: number }) {
  const yen = locales.numberFormat({
    style: 'currency',
    currency: 'JPY',
  });
  return <span>{yen.format(amount)}</span>;
}`;

const PUBLISHED_AT = `import { locales } from '../i18n';

export function PublishedAt({ date }: { date: Date }) {
  return (
    <time dateTime={date.toISOString()}>
      {locales.dateTimeFormat({ dateStyle: 'medium' }).format(date)}
    </time>
  );
}`;

const CART = `import { message } from '@k8ordo/i18n';

import { locales } from '../i18n';

const long = () => locales.dateTimeFormat({ dateStyle: 'long' });

export const items = message({
  ja: (count: number) => \`\${String(count)}件\`,
  en: (count) =>
    locales.pluralRules().select(count) === 'one'
      ? \`\${String(count)} item\`
      : \`\${String(count)} items\`,
});

export const updated = message({
  ja: (date: Date) => \`\${long().format(date)}に更新\`,
  en: (date) => \`Updated \${long().format(date)}\`,
});`;

export default function I18nFormattingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/formatting">
      <DocSection id="intl" title={t.membersTitle}>
        <CodeBlock
          callouts={{ 4: t.priceCallout() }}
          code={PRICE}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="src/components/price.tsx"
        />
        <p>
          <Rich>{t.membersIntro()}</Rich>
        </p>
        <ul>
          {t.membersList.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.membersItself()}</Rich>
        </p>
        <p>
          <Rich>{t.membersOthers()}</Rich>
        </p>
      </DocSection>

      <DocSection id="dates" title={t.datesTitle}>
        <CodeBlock
          callouts={{ 6: t.publishedAtCallout() }}
          code={PUBLISHED_AT}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/components/published-at.tsx"
        />
        <p>
          <Rich>{t.datesZone()}</Rich>
          <Rich>{t.datesChooseBefore()}</Rich>
          <LocaleAnchor path="/:locale/i18n/locales">
            {m.i18n.navLocales()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.datesRefuse()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.datesVisitor()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <TimeZoneDemo />
      </Playground>

      <DocSection id="in-messages" title={t.inMessagesTitle}>
        <CodeBlock
          callouts={{ 10: t.cartCallout() }}
          code={CART}
          lang="ts"
          marks={{ 10: 'highlight', 16: 'highlight', 17: 'highlight' }}
          title="src/messages/cart.ts"
        />
        <p>
          <Rich>{t.inMessagesCall()}</Rich>
        </p>
        <p>
          <Rich>{t.inMessagesPlural()}</Rich>
        </p>
      </DocSection>

      <DocSection id="cache" title={t.cacheTitle}>
        <p>
          <Rich>{t.cacheOnce()}</Rich>
        </p>
        <p>
          <Rich>{t.cacheKey()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
