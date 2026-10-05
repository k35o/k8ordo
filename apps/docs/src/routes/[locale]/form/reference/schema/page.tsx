import type { Message } from '@k8ordo/i18n';

import { Pitfall } from '../../../../../components/callout';
import { DocPage, DocSection } from '../../../../../components/doc-page';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const t = m.formReferenceSchema;

const List = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function FormReferenceSchemaPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/form/reference/schema"
    >
      <DocSection
        description={t.typesDescription}
        id="types"
        title={t.typesTitle}
      >
        <List
          items={[
            t.typeString,
            t.typeEmailUrl,
            t.typeDate,
            t.typeDatetime,
            t.typeNumber,
            t.typeBoolean,
            t.typeStringbool,
            t.typeFile,
            t.typePassword,
            t.typeEnum,
            t.typeEnumArray,
            t.typeOther,
          ]}
        />
        <p>
          <Rich>{t.typesFormat()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.attrsDescription}
        id="attributes"
        title={t.attrsTitle}
      >
        <List
          items={[
            t.attrLength,
            t.attrRegex,
            t.attrRange,
            t.attrStep,
            t.attrMime,
            t.attrRequired,
          ]}
        />
      </DocSection>

      <DocSection
        description={t.emptyDescription}
        id="empty"
        title={t.emptyTitle}
      >
        <List
          items={[
            t.emptyText,
            t.emptyCheckbox,
            t.emptyNothing,
            t.emptyStringbool,
            t.emptyGroup,
          ]}
        />
      </DocSection>

      <DocSection
        description={t.droppedDescription}
        id="dropped"
        title={t.droppedTitle}
      >
        <List
          items={[
            t.droppedRefine,
            t.droppedExclusive,
            t.droppedRegex,
            t.droppedPattern,
            t.droppedMime,
            t.droppedGroupMin,
            t.droppedTransform,
          ]}
        />
        <Pitfall>
          <p>
            <Rich>{t.droppedNotYet()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.refusedDescription}
        id="refused"
        title={t.refusedTitle}
      >
        <List
          items={[
            t.refusedNumber,
            t.refusedShape,
            t.refusedKey,
            t.refusedStringbool,
          ]}
        />
      </DocSection>

      <DocSection id="not-yet" title={t.notYetTitle}>
        <List items={[t.notYetFiles, t.notYetRowRules, t.notYetMask]} />
      </DocSection>
    </DocPage>
  );
}
