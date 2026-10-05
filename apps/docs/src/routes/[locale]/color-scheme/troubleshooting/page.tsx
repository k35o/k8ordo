import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeTroubleshooting;

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
};

const SYMPTOMS: readonly Symptom[] = [
  { id: 'flash', title: t.flashTitle, cause: t.flashCause, fix: t.flashFix },
  { id: 'csp', title: t.cspTitle, cause: t.cspCause, fix: t.cspFix },
  {
    id: 'hydration',
    title: t.hydrationTitle,
    cause: t.hydrationCause,
    fix: t.hydrationFix,
  },
  {
    id: 'native',
    title: t.nativeTitle,
    cause: t.nativeCause,
    fix: t.nativeFix,
  },
  {
    id: 'tailwind',
    title: t.tailwindTitle,
    cause: t.tailwindCause,
    fix: t.tailwindFix,
  },
  { id: 'icon', title: t.iconTitle, cause: t.iconCause, fix: t.iconFix },
  {
    id: 'outside',
    title: t.outsideTitle,
    cause: t.outsideCause,
    fix: t.outsideFix,
  },
  {
    id: 'system',
    title: t.systemTitle,
    cause: t.systemCause,
    fix: t.systemFix,
  },
  {
    id: 'storage',
    title: t.storageTitle,
    cause: t.storageCause,
    fix: t.storageFix,
  },
  {
    id: 'script',
    title: t.scriptTitle,
    cause: t.scriptCause,
    fix: t.scriptFix,
  },
];

export default function ColorSchemeTroubleshootingPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/troubleshooting"
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
