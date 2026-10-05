import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.i18nTroubleshooting;

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
};

const SYMPTOMS: readonly Symptom[] = [
  {
    id: 'missing',
    title: t.missingTitle,
    cause: t.missingCause,
    fix: t.missingFix,
  },
  {
    id: 'untyped',
    title: t.untypedTitle,
    cause: t.untypedCause,
    fix: t.untypedFix,
  },
  {
    id: 'frozen',
    title: t.frozenTitle,
    cause: t.frozenCause,
    fix: t.frozenFix,
  },
  { id: 'date', title: t.dateTitle, cause: t.dateCause, fix: t.dateFix },
  {
    id: 'schema',
    title: t.schemaTitle,
    cause: t.schemaCause,
    fix: t.schemaFix,
  },
  {
    id: 'storage',
    title: t.storageTitle,
    cause: t.storageCause,
    fix: t.storageFix,
  },
  { id: 'run', title: t.runTitle, cause: t.runCause, fix: t.runFix },
  {
    id: 'ui-english',
    title: t.uiEnglishTitle,
    cause: t.uiEnglishCause,
    fix: t.uiEnglishFix,
  },
  {
    id: 'ui-missing',
    title: t.uiMissingTitle,
    cause: t.uiMissingCause,
    fix: t.uiMissingFix,
  },
  {
    id: 'paths',
    title: t.pathsTitle,
    cause: t.pathsCause,
    fix: t.pathsFix,
  },
  {
    id: 'double',
    title: t.doubleTitle,
    cause: t.doubleCause,
    fix: t.doubleFix,
  },
  {
    id: 'not-found',
    title: t.notFoundTitle,
    cause: t.notFoundCause,
    fix: t.notFoundFix,
  },
  {
    id: 'boundary',
    title: t.boundaryTitle,
    cause: t.boundaryCause,
    fix: t.boundaryFix,
  },
  { id: 'form', title: t.formTitle, cause: t.formCause, fix: t.formFix },
];

export default function I18nTroubleshootingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/i18n/troubleshooting">
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
