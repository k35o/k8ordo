import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateTroubleshooting;

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
};

const SYMPTOMS: readonly Symptom[] = [
  {
    id: 'absence',
    title: t.absenceTitle,
    cause: t.absenceCause,
    fix: t.absenceFix,
  },
  {
    id: 'url-boolean',
    title: t.urlBooleanTitle,
    cause: t.urlBooleanCause,
    fix: t.urlBooleanFix,
  },
  {
    id: 'url-array',
    title: t.urlArrayTitle,
    cause: t.urlArrayCause,
    fix: t.urlArrayFix,
  },
  {
    id: 'client-module',
    title: t.clientModuleTitle,
    cause: t.clientModuleCause,
    fix: t.clientModuleFix,
  },
  {
    id: 'static-search',
    title: t.staticSearchTitle,
    cause: t.staticSearchCause,
    fix: t.staticSearchFix,
  },
  {
    id: 'serialization',
    title: t.serializationTitle,
    cause: t.serializationCause,
    fix: t.serializationFix,
  },
  {
    id: 'full-load',
    title: t.fullLoadTitle,
    cause: t.fullLoadCause,
    fix: t.fullLoadFix,
  },
  {
    id: 'stringbool',
    title: t.stringboolTitle,
    cause: t.stringboolCause,
    fix: t.stringboolFix,
  },
  { id: 'date', title: t.dateTitle, cause: t.dateCause, fix: t.dateFix },
  {
    id: 'shared-key',
    title: t.sharedKeyTitle,
    cause: t.sharedKeyCause,
    fix: t.sharedKeyFix,
  },
  {
    id: 'url-flash',
    title: t.urlFlashTitle,
    cause: t.urlFlashCause,
    fix: t.urlFlashFix,
  },
  {
    id: 'cookie-flash',
    title: t.cookieFlashTitle,
    cause: t.cookieFlashCause,
    fix: t.cookieFlashFix,
  },
  {
    id: 'safari-cookie',
    title: t.safariCookieTitle,
    cause: t.safariCookieCause,
    fix: t.safariCookieFix,
  },
  {
    id: 'test-leak',
    title: t.testLeakTitle,
    cause: t.testLeakCause,
    fix: t.testLeakFix,
  },
  {
    id: 'test-navigates',
    title: t.testNavigatesTitle,
    cause: t.testNavigatesCause,
    fix: t.testNavigatesFix,
  },
];

export default function StateTroubleshootingPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/state/troubleshooting"
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
          </p>
        </DocSection>
      ))}
    </DocPage>
  );
}
