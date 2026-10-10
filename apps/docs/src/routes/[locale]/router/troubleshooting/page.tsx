import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import type { SitePath } from '../../../../links';
import * as m from '../../../../messages';

const t = m.routerTroubleshooting;

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
  fixLink?: { path: SitePath; label: Message; after: Message };
};

const SYMPTOMS: readonly Symptom[] = [
  {
    id: 'reload',
    title: t.reloadTitle,
    cause: t.reloadCause,
    fix: t.reloadFix,
  },
  { id: 'file', title: t.fileTitle, cause: t.fileCause, fix: t.fileFix },
  { id: 'order', title: t.orderTitle, cause: t.orderCause, fix: t.orderFix },
  {
    id: 'use-params',
    title: t.paramsTitle,
    cause: t.paramsCause,
    fix: t.paramsFix,
  },
  {
    id: 'framework-hooks',
    title: t.frameworkTitle,
    cause: t.frameworkCause,
    fix: t.frameworkFix,
    fixLink: {
      path: '/:locale/framework/params',
      label: m.framework.navParams,
      after: t.frameworkFixAfter,
    },
  },
  {
    id: 'use-pathname',
    title: t.pathnameTitle,
    cause: t.pathnameCause,
    fix: t.pathnameFix,
  },
  {
    id: 'bound-options',
    title: t.optionsTitle,
    cause: t.optionsCause,
    fix: t.optionsFix,
  },
  { id: 'early', title: t.earlyTitle, cause: t.earlyCause, fix: t.earlyFix },
  { id: 'lazy', title: t.lazyTitle, cause: t.lazyCause, fix: t.lazyFix },
  { id: 'abort', title: t.abortTitle, cause: t.abortCause, fix: t.abortFix },
  { id: 'fade', title: t.fadeTitle, cause: t.fadeCause, fix: t.fadeFix },
  { id: 'error', title: t.errorTitle, cause: t.errorCause, fix: t.errorFix },
  {
    id: 'register',
    title: t.registerTitle,
    cause: t.registerCause,
    fix: t.registerFix,
  },
];

export default function RouterTroubleshootingPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/router/troubleshooting"
    >
      {SYMPTOMS.map((symptom) => (
        <DocSection id={symptom.id} key={symptom.id} title={symptom.title}>
          <Heading level="h3">{t.causeLabel()}</Heading>
          <p>
            <Rich>{symptom.cause()}</Rich>
          </p>
          <Heading level="h3">{t.fixLabel()}</Heading>
          <p>
            <Rich>{symptom.fix()}</Rich>
            {symptom.fixLink === undefined ? null : (
              <>
                <LocaleAnchor path={symptom.fixLink.path}>
                  {symptom.fixLink.label()}
                </LocaleAnchor>
                <Rich>{symptom.fixLink.after()}</Rich>
              </>
            )}
          </p>
        </DocSection>
      ))}
    </DocPage>
  );
}
