import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import * as m from '../../../messages';

const HERO_LOCALES = `export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});`;

const HERO_MESSAGE = `export const home = message({ ja: 'ホーム', en: 'Home' });`;

const HERO_USE = `<a href="/">{nav.home()}</a>`;

// コード例の中の `export const { paramsSchema }` は文字列なので、生成器
// （ファイルをパースして export を読む）はこのページの export と取り違えない
const CLAIM_SERVER_LAYOUT = `export const { paramsSchema } = locales;`;

const CLAIM_SERVER_PAGE = `export default function Page() {
  return <h1>{nav.home()}</h1>;
}`;

const CLAIM_TYPES_REGISTER = `declare module '@k8ordo/i18n' {
  interface Register {
    locale: LocaleOf<typeof locales>;
  }
}`;

const CLAIM_TYPES_MESSAGES = `export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`,
});

export const save = message({ ja: '保存' });`;

const CLAIM_BUNDLE = `'use client';

import { greeting } from '../messages/nav';

export function Greeting({ name }: { name: string }) {
  return <p>{greeting(name)}</p>;
}`;

export default function I18nPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_LOCALES} lang="ts" title="i18n.ts" />
            <CodeBlock code={HERO_MESSAGE} lang="ts" title="messages/nav.ts" />
            <CodeBlock code={HERO_USE} lang="tsx" title="header.tsx" />
          </>
        }
        directory="i18n"
        install="@k8ordo/i18n"
        name="@k8ordo/i18n"
        tagline={m.i18n.tagline}
      />
      <LandingClaim
        body={m.i18n.claimServerBody}
        title={m.i18n.claimServerTitle}
      >
        <div className="flex flex-col gap-3">
          <CodeBlock
            code={CLAIM_SERVER_LAYOUT}
            lang="tsx"
            title="routes/[locale]/layout.tsx"
          />
          <CodeBlock
            code={CLAIM_SERVER_PAGE}
            lang="tsx"
            title="routes/[locale]/page.tsx"
          />
        </div>
      </LandingClaim>
      <LandingClaim body={m.i18n.claimTypesBody} title={m.i18n.claimTypesTitle}>
        <div className="flex flex-col gap-3">
          <CodeBlock code={CLAIM_TYPES_REGISTER} lang="ts" title="i18n.ts" />
          <CodeBlock
            callouts={{ 6: m.i18n.claimTypesMissing() }}
            code={CLAIM_TYPES_MESSAGES}
            lang="ts"
            title="messages/nav.ts"
          />
        </div>
      </LandingClaim>
      <LandingClaim
        body={m.i18n.claimBundleBody}
        title={m.i18n.claimBundleTitle}
      >
        <CodeBlock code={CLAIM_BUNDLE} lang="tsx" title="greeting.tsx" />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/i18n"
        steps={[
          {
            path: '/:locale/i18n/get-started',
            label: m.nav.getStarted,
            description: m.i18n.nextGetStarted,
          },
          {
            path: '/:locale/i18n/locales',
            label: m.i18n.navLocales,
            description: m.i18n.nextLocales,
          },
          {
            path: '/:locale/i18n/messages',
            label: m.i18n.navMessages,
            description: m.i18n.nextMessages,
          },
          {
            path: '/:locale/i18n/formatting',
            label: m.i18n.navFormatting,
            description: m.i18n.nextFormatting,
          },
          {
            path: '/:locale/i18n/routing',
            label: m.i18n.navRouting,
            description: m.i18n.nextRouting,
          },
          {
            path: '/:locale/i18n/integrations',
            label: m.i18n.navIntegrations,
            description: m.i18n.nextIntegrations,
          },
        ]}
      />
    </div>
  );
}
