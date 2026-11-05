import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
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

const POSITION = `<head>
  <meta charset="utf-8" />
  <script>(() => { … })()</script>
  <link rel="stylesheet" href="/assets/index.css" />
</head>`;

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
      <DocSection id="rule" title={t.ruleTitle}>
        <CodeBlock
          code={RULE}
          lang="ts"
          marks={{ 7: 'highlight', 8: 'highlight', 9: 'highlight' }}
          title="scheme.ts"
        />
        <p>
          <Rich>{t.ruleOrder()}</Rich>
        </p>
        <ol>
          {[t.ruleChoice, t.ruleDefault, t.ruleSystem].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ol>
        <p>
          <Rich>{t.ruleNone()}</Rich>
        </p>
        <p>
          <Rich>{t.ruleNotPinned()}</Rich>
        </p>
      </DocSection>

      <DocSection id="readers" title={t.readersTitle}>
        <CodeBlock
          callouts={{ 15: t.readersScriptDefault() }}
          code={SCRIPT}
          lang="js"
          marks={{ 15: 'highlight' }}
        />
        <p>
          <Rich>{t.readersScript()}</Rich>
        </p>
        <p>
          <Rich>{t.readersWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.readersHand()}</Rich>
        </p>
      </DocSection>

      <DocSection id="position" title={t.positionTitle}>
        <CodeBlock
          callouts={{ 3: t.positionScriptCallout() }}
          code={POSITION}
          lang="html"
          marks={{ 3: 'highlight' }}
        />
        <p>
          <Rich>{t.positionOrder()}</Rich>
        </p>
        <p>
          <Rich>{t.positionHead()}</Rich>
        </p>
        <p>
          <Rich>{t.positionHydration()}</Rich>
        </p>
      </DocSection>

      <DocSection id="hydration" title={t.hydrationTitle}>
        <CodeBlock
          code={READS_STORE}
          lang="tsx"
          marks={{ 9: 'highlight' }}
          title="provider.tsx"
        />
        <p>
          <Rich>{t.hydrationGuess()}</Rich>
        </p>
        <p>
          <Rich>{t.hydrationReadsStore()}</Rich>
        </p>
        <p>
          <Rich>{t.hydrationMarkup()}</Rich>
          <LocaleAnchor path="/:locale/color-scheme/switcher">
            {m.colorScheme.navSwitcher()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="after" title={t.afterTitle}>
        <p>
          <Rich>{t.afterProvider()}</Rich>
        </p>
        <ul>
          {[t.afterChoice, t.afterSystem, t.afterTabs].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <Playground
        description={t.inspectorDescription}
        id="inspector"
        steps={t.inspectorSteps}
        title={t.inspectorTitle}
      >
        <SchemeInspector />
      </Playground>

      <DocSection id="guarantees" title={t.guaranteesTitle}>
        <ul>
          {[
            t.guaranteeFirstPaint,
            t.guaranteeSameRule,
            t.guaranteeHydration,
            t.guaranteeDefault,
            t.guaranteeWrite,
            t.guaranteeTabs,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="non-guarantees" title={t.nonGuaranteesTitle}>
        <ul>
          {[
            t.nonGuaranteeServer,
            t.nonGuaranteeMarkup,
            t.nonGuaranteeCsp,
            t.nonGuaranteePosition,
            t.nonGuaranteeSameDefault,
            t.nonGuaranteeTwoProviders,
            t.nonGuaranteeSameTab,
            t.nonGuaranteeStyles,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
