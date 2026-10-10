import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateHowItWorks;

const SHAPE = `shared   definePageState / defineLocalState / defineSessionState
         defineCookieState / defineMemoryState
           ↓ import                     ↓ import
server   parseUrl(searchParams)       client   useAppState(def)
         parseCookies(cookies)                 → [state, update]
         href(path, values)`;

export default function StateHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/how-it-works">
      <DocSection id="shape" title={t.shapeTitle}>
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.shapeDefinition()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeStore()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeServer()}</Rich>
        </p>
      </DocSection>

      <DocSection id="no-provider" title={t.providerTitle}>
        <p>
          <Rich>{t.providerSingleton()}</Rich>
        </p>
        <p>
          <Rich>{t.providerTestsBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/testing">
            {m.state.navTesting()}
          </LocaleAnchor>
          <Rich>{t.providerTestsAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="router" title={t.routerTitle}>
        <p>
          <Rich>{t.routerTwo()}</Rich>
        </p>
        <p>
          <Rich>{t.routerStateChange()}</Rich>
        </p>
        <p>
          <Rich>{t.routerSearchBefore()}</Rich>
          <LocaleAnchor path="/:locale/framework/params">
            {m.framework.navParams()}
          </LocaleAnchor>
          <Rich>{t.routerSearchAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="salvage" title={t.salvageTitle}>
        <p>
          <Rich>{t.salvageInput()}</Rich>
        </p>
        <ol>
          {[
            t.salvageWhole,
            t.salvageFields,
            t.salvageAgain,
            t.salvageDefaults,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ol>
        <p>
          <Rich>{t.salvageRaw()}</Rich>
        </p>
        <p>
          <Rich>{t.salvageUrlBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/url">
            {m.state.navUrl()}
          </LocaleAnchor>
          <Rich>{t.salvageUrlAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="change" title={t.changeTitle}>
        <p>
          <Rich>{t.changeKeys()}</Rich>
        </p>
        <p>
          <Rich>{t.changeCompare()}</Rich>
        </p>
      </DocSection>

      <DocSection id="shared" title={t.sharedTitle}>
        <p>
          <Rich>{t.sharedOwn()}</Rich>
        </p>
        <p>
          <Rich>{t.sharedLive()}</Rich>
        </p>
        <p>
          <Rich>{t.sharedCookie()}</Rich>
        </p>
      </DocSection>

      <DocSection id="guarantees" title={t.guaranteesTitle}>
        <ul>
          {[
            t.guaranteeRead,
            t.guaranteeEcho,
            t.guaranteeEntry,
            t.guaranteeCarry,
            t.guaranteeIdentity,
            t.guaranteeHydration,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="non-guarantees" title={t.nonGuaranteesTitle}>
        <ul>
          {[t.nonKey, t.nonServer].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
          <li>
            <Rich>{t.nonRouter()}</Rich>
            <Rich>{t.nonRouterNextjsBefore()}</Rich>
            <LocaleAnchor path="/:locale/state/nextjs">
              {m.state.navNextjs()}
            </LocaleAnchor>
            <Rich>{t.nonRouterNextjsAfter()}</Rich>
          </li>
          {[t.nonMutation, t.nonMemory, t.nonWrite].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
