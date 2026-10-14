
import { CodeBlock } from '../../../../components/code-block';
import { Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nHowItWorks;

const SIDES = `server   locales.run('en', fn)        → AsyncLocalStorage
         paramsSchema accepts 'en'    → AsyncLocalStorage
         home()                       → reads the storage → 'Home'

browser  location.pathname '/en/ui'   → first segment 'en'
         home()                       → reads the URL     → 'Home'`;

const SAVE = `'use client';

import { save } from '../messages/form';

export function SaveButton() {
  return <button type="submit">{save()}</button>;
}`;

export default function I18nHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/how-it-works">
      <DocSection id="where" title={t.whereTitle}>
        <CodeBlock code={SIDES} lang="text" />
        <p>
          <Rich>{t.whereIntro()}</Rich>
        </p>
        <DocSubsection id="server" title={t.serverTitle}>
          <p>
            <Rich>{t.serverStorage()}</Rich>
          </p>
          <p>
            <Rich>{t.serverGlobal()}</Rich>
          </p>
          <p>
            <Rich>{t.serverScope()}</Rich>
            <LocaleAnchor path="/:locale/framework/params">
              {m.framework.navParams()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="browser" title={t.browserTitle}>
          <p>
            <Rich>{t.browserUrl()}</Rich>
          </p>
          <p>
            <Rich>{t.browserBeforeSet()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="last-set" title={t.lastTitle}>
        <p>
          <Rich>{t.lastRegister()}</Rich>
        </p>
        <p>
          <Rich>{t.lastWins()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.lastPitfall()}</Rich>
            <LocaleAnchor path="/:locale/i18n/testing">
              {m.i18n.navTesting()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="function" title={t.functionTitle}>
        <CodeBlock
          callouts={{ 6: t.functionCallout() }}
          code={SAVE}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/components/save-button.tsx"
        />
        <p>
          <Rich>{t.functionReturns()}</Rich>
        </p>
        <p>
          <Rich>{t.functionBundle()}</Rich>
        </p>
        <p>
          <Rich>{t.functionReasonsIntro()}</Rich>
        </p>
        <ul>
          {[
            t.functionReasonDictionary,
            t.functionReasonThrow,
            t.functionReasonNoSet,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="guarantees" title={t.guaranteesTitle}>
        <ul>
          {t.guarantees.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="non-guarantees" title={t.nonGuaranteesTitle}>
        <ul>
          {t.nonGuarantees.map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
