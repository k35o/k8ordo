
import { CodeBlock } from '../../../components/code-block';
import { LandingClaim, LandingHero } from '../../../components/landing';
import * as m from '../../../messages';

const HERO_LOCALES = `import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});`;

const HERO_MESSAGE = `import { message } from '@k8ordo/i18n';

export const home = message({ ja: 'ホーム', en: 'Home' });`;

const HERO_USE = `import { home } from '../messages/nav';

export function Header() {
  return (
    <header>
      <a href="/">{home()}</a>
    </header>
  );
}`;

const CLAIM_SERVER_TITLE = `import { home } from '../messages/nav';

export function PageTitle() {
  return <h1>{home()}</h1>;
}`;

const CLAIM_SERVER_LINK = `'use client';

import { home } from '../messages/nav';

export function HomeLink() {
  return <a href="/">{home()}</a>;
}`;

const CLAIM_TYPES_MESSAGES = `import { message } from '@k8ordo/i18n';

export const greeting = message({
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
            <CodeBlock code={HERO_LOCALES} lang="ts" title="src/i18n.ts" />
            <CodeBlock
              code={HERO_MESSAGE}
              lang="ts"
              title="src/messages/nav.ts"
            />
            <CodeBlock
              code={HERO_USE}
              lang="tsx"
              title="src/components/header.tsx"
            />
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
            code={CLAIM_SERVER_TITLE}
            lang="tsx"
            title="src/components/page-title.tsx"
          />
          <CodeBlock
            code={CLAIM_SERVER_LINK}
            lang="tsx"
            title="src/components/home-link.tsx"
          />
        </div>
      </LandingClaim>
      <LandingClaim body={m.i18n.claimTypesBody} title={m.i18n.claimTypesTitle}>
        <CodeBlock
          callouts={{ 8: m.i18n.claimTypesMissing() }}
          code={CLAIM_TYPES_MESSAGES}
          lang="ts"
          title="src/messages/nav.ts"
        />
      </LandingClaim>
      <LandingClaim
        body={m.i18n.claimBundleBody}
        title={m.i18n.claimBundleTitle}
      >
        <CodeBlock
          code={CLAIM_BUNDLE}
          lang="tsx"
          title="src/components/greeting.tsx"
        />
      </LandingClaim>
    </div>
  );
}
