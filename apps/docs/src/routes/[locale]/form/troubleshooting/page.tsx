import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.formTroubleshooting;

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
    id: 'optional',
    title: t.optionalTitle,
    cause: t.optionalCause,
    fix: t.optionalFix,
  },
  { id: 'mini', title: t.miniTitle, cause: t.miniCause, fix: t.miniFix },
  { id: 'radio', title: t.radioTitle, cause: t.radioCause, fix: t.radioFix },
  { id: 'focus', title: t.focusTitle, cause: t.focusCause, fix: t.focusFix },
  {
    id: 'hidden',
    title: t.hiddenTitle,
    cause: t.hiddenCause,
    fix: t.hiddenFix,
  },
  {
    id: 'stringbool',
    title: t.stringboolTitle,
    cause: t.stringboolCause,
    fix: t.stringboolFix,
  },
  {
    id: 'number',
    title: t.numberTitle,
    cause: t.numberCause,
    fix: t.numberFix,
  },
];

export default function FormTroubleshootingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/form/troubleshooting">
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
