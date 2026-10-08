import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { SchemeInspector } from '../../../../demos/color-scheme/how-it-works/scheme-inspector';
import * as m from '../../../../messages';

const t = m.colorSchemeHowItWorks;

const RULE = `const resolve = (
  preference: ColorScheme | undefined,
  defaultPreference: ColorSchemePreference,
  systemDark: boolean,
): ColorScheme => {
  const chosen =
    preference ??
    (defaultPreference === 'system' ? undefined : defaultPreference);
  return chosen ?? (systemDark ? 'dark' : 'light');
};`;

const SCRIPT = `(() => {
  const s = (() => {
    try {
      const v = JSON.parse(
        localStorage.getItem('k8ordo-state:color-scheme'),
      );
      return v !== null && typeof v === 'object' && !Array.isArray(v)
        ? v
        : null;
    } catch {
      return null;
    }
  })();
  const v = s && s.preference;
  const p = v === 'dark' || v === 'light' ? v : 'system';
  if (
    p === 'dark' ||
    (p !== 'light' &&
      matchMedia('(prefers-color-scheme: dark)').matches)
  )
    document.documentElement.classList.add('dark');
})();`;

const FIRST_CHILD = `return (
  <>
    <script nonce={nonce}>{scriptFor(defaultPreference)}</script>
    <ColorSchemeContext value={value}>{children}</ColorSchemeContext>
  </>
);`;

const READS_STORE = `const useReadsStore = (): boolean =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

useEffect(() => {
  if (!readsStore) return;
  document.documentElement.classList.toggle(
    DARK_CLASS,
    scheme === 'dark',
  );
}, [readsStore, scheme]);`;

export default function ColorSchemeHowItWorksPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/how-it-works"
    >
      <DocSection description={t.ruleDescription} id="rule" title={t.ruleTitle}>
        <ol>
          {[t.ruleChoice, t.ruleDefault, t.ruleSystem].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ol>
        <CodeBlock code={RULE} lang="ts" title="scheme.ts" />
        <p>
          <Rich>{t.ruleNone()}</Rich>
        </p>
        <p>
          <Rich>{t.ruleNotPinned()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.readersDescription}
        id="readers"
        title={t.readersTitle}
      >
        <p>
          <Rich>{t.readersWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.readersScript()}</Rich>
        </p>
        <CodeBlock
          callouts={{ 15: t.readersScriptDefault() }}
          code={SCRIPT}
          lang="js"
          marks={{ 15: 'highlight' }}
        />
        <p>
          <Rich>{t.readersHand()}</Rich>
        </p>
        <p>
          <Rich>{t.readersRow()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.firstChildDescription}
        id="first-child"
        title={t.firstChildTitle}
      >
        <CodeBlock
          code={FIRST_CHILD}
          lang="tsx"
          marks={{ 3: 'highlight' }}
          title="provider.tsx"
        />
        <p>
          <Rich>{t.firstChildBody()}</Rich>
        </p>
        <p>
          <Rich>{t.firstChildHydration()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.hydrationDescription}
        id="hydration"
        title={t.hydrationTitle}
      >
        <p>
          <Rich>{t.hydrationGuess()}</Rich>
        </p>
        <CodeBlock
          code={READS_STORE}
          lang="tsx"
          marks={{ 9: 'highlight' }}
          title="provider.tsx"
        />
        <p>
          <Rich>{t.hydrationNext()}</Rich>
        </p>
        <p>
          <Rich>{t.hydrationSuppress()}</Rich>
        </p>
        <p>
          <Rich>{t.hydrationNoGuess()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme/switcher">
            {t.hydrationLink()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.afterDescription}
        id="after"
        title={t.afterTitle}
      >
        <ul>
          {[t.afterChoice, t.afterSystem, t.afterTabs].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <Pitfall>
          <p>
            <Rich>{t.afterOne()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <Playground
        description={t.inspectorDescription}
        id="inspector"
        steps={t.inspectorSteps}
        title={t.inspectorTitle}
      >
        <SchemeInspector />
      </Playground>

      <DocSection
        description={t.guaranteesDescription}
        id="guarantees"
        title={t.guaranteesTitle}
      >
        <ul>
          {[
            t.guaranteeNoFlash,
            t.guaranteeDefault,
            t.guaranteeServer,
            t.guaranteeTabs,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <DocSubsection id="limits" title={t.limitsTitle}>
          <ul>
            {[
              t.limitGuess,
              t.limitClass,
              t.limitProperty,
              t.limitContrast,
              t.limitPolicy,
            ].map((item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ))}
          </ul>
        </DocSubsection>
      </DocSection>
    </DocPage>
  );
}
