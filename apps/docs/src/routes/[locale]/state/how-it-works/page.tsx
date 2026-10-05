import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
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
      <DocSection
        description={t.shapeDescription}
        id="shape"
        title={t.shapeTitle}
      >
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.shapeStore()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeImport()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeDuplicate()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.providerDescription}
        id="no-provider"
        title={t.providerTitle}
      >
        <p>
          <Rich>{t.providerTests()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.routerDescription}
        id="router"
        title={t.routerTitle}
      >
        <ul>
          {[
            t.routerLinks,
            t.routerNoNavigation,
            t.routerUrlUpdate,
            t.routerServer,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.routerStateChange()}</Rich>
        </p>
        <p>
          <Rich>{t.routerSearchPage()}</Rich>
        </p>
        <p>
          <Rich>{t.routerOthers()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.salvageDescription}
        id="salvage"
        title={t.salvageTitle}
      >
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
          <Rich>{t.salvageInput()}</Rich>
        </p>
        <p>
          <Rich>{t.salvageRoad()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.changeDescription}
        id="change"
        title={t.changeTitle}
      >
        <p>
          <Rich>{t.changeCompare()}</Rich>
        </p>
        <p>
          <Rich>{t.changeIdentity()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.sharedDescription}
        id="shared"
        title={t.sharedTitle}
      >
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
    </DocPage>
  );
}
