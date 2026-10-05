import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nHowItWorks;

const SAVE = `'use client';

import * as m from '../messages';

export function SaveButton() {
  return <button type="submit">{m.form.save()}</button>;
}`;

const SIDES = `server   paramsSchema accepts 'en'    → AsyncLocalStorage
         nav.home()                   → reads the storage → 'Home'

browser  location.pathname '/en/ui'   → first segment 'en'
         nav.home()                   → reads the URL     → 'Home'`;

export default function I18nHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/how-it-works">
      <DocSection
        description={t.functionDescription}
        id="function"
        title={t.functionTitle}
      >
        <CodeBlock
          callouts={{ 6: t.functionCallout() }}
          code={SAVE}
          lang="tsx"
          title="save-button.tsx"
        />
        <p>
          <Rich>{t.functionBundle()}</Rich>
        </p>
        <p>
          <Rich>{t.functionServer()}</Rich>
        </p>
        <p>
          <Rich>{t.functionThrow()}</Rich>
        </p>
        <p>
          <Rich>{t.functionNoSet()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.functionMeasure()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.whereDescription}
        id="where"
        title={t.whereTitle}
      >
        <CodeBlock code={SIDES} lang="text" />
        <DocSubsection id="server" title={t.serverTitle}>
          <p>
            <Rich>{t.serverStorage()}</Rich>
          </p>
          <p>
            <Rich>{t.serverBuiltin()}</Rich>
          </p>
          <p>
            <Rich>{t.serverGlobal()}</Rich>
          </p>
          <p>
            <Rich>{t.serverPattern()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="browser" title={t.browserTitle}>
          <p>
            <Rich>{t.browserUrl()}</Rich>
          </p>
          <p>
            <Rich>{t.browserDetect()}</Rich>
          </p>
          <p>
            <Rich>{t.browserBeforeSet()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection
        description={t.lastDescription}
        id="last-set"
        title={t.lastTitle}
      >
        <p>
          <Rich>{t.lastWins()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.lastPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.providerDescription}
        id="no-provider"
        title={t.providerTitle}
      >
        <ul>
          {[t.providerServer, t.providerAnywhere, t.providerNoState].map(
            (item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ),
          )}
        </ul>
      </DocSection>
    </DocPage>
  );
}
