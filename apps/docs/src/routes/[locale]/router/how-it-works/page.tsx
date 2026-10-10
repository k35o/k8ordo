import type { Message } from '@k8ordo/i18n';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerHowItWorks;

const List = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function RouterHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/how-it-works">
      <DocSection id="where" title={t.whereTitle}>
        <p>
          <Rich>{t.whereHook()}</Rich>
        </p>
        <p>
          <Rich>{t.whereSame()}</Rich>
        </p>
        <p>
          <Rich>{t.whereOwnBefore()}</Rich>
          <LocaleAnchor path="/:locale/router/reference">
            {m.router.navReference()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="claim" title={t.claimTitle}>
        <p>
          <Rich>{t.claimEvent()}</Rich>
        </p>
        <p>
          <Rich>{t.claimNever()}</Rich>
        </p>
        <List
          items={[t.claimReload, t.claimPost, t.claimDownload, t.claimFragment]}
        />
        <p>
          <Rich>{t.claimOther()}</Rich>
          <Rich>{t.claimGet()}</Rich>
          <Rich>{t.claimStateBefore()}</Rich>
          <LocaleAnchor path="/:locale/state/updates">
            {m.state.navUpdates()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="finished" title={t.finishedTitle}>
        <p>
          <Rich>{t.finishedScreen()}</Rich>
        </p>
        <p>
          <Rich>{t.finishedPaint()}</Rich>
        </p>
        <p>
          <Rich>{t.finishedLazy()}</Rich>
        </p>
      </DocSection>

      <DocSection id="state" title={t.stateTitle}>
        <p>
          <Rich>{t.stateInPlace()}</Rich>
        </p>
        <p>
          <Rich>{t.stateRefresh()}</Rich>
        </p>
        <p>
          <Rich>{t.stateShown()}</Rich>
        </p>
      </DocSection>

      <DocSection id="background" title={t.backgroundTitle}>
        <p>
          <Rich>{t.backgroundDeferred()}</Rich>
        </p>
        <p>
          <Rich>{t.backgroundNotTransition()}</Rich>
        </p>
        <p>
          <Rich>{t.backgroundTypesBefore()}</Rich>
          <LocaleAnchor path="/:locale/router/animate">
            {m.router.navAnimate()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="scroll" title={t.scrollTitle}>
        <p>
          <Rich>{t.scrollTop()}</Rich>
        </p>
        <p>
          <Rich>{t.scrollFragment()}</Rich>
        </p>
        <p>
          <Rich>{t.scrollTraverse()}</Rich>
        </p>
      </DocSection>

      <DocSection id="abort" title={t.abortTitle}>
        <p>
          <Rich>{t.abortSignal()}</Rich>
        </p>
        <p>
          <Rich>{t.abortLazy()}</Rich>
        </p>
      </DocSection>

      <DocSection id="guarantees" title={t.guaranteesTitle}>
        <List items={t.guarantees} />
      </DocSection>

      <DocSection id="non-guarantees" title={t.nonGuaranteesTitle}>
        <List items={t.nonGuarantees} />
      </DocSection>
    </DocPage>
  );
}
