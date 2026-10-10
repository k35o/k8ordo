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
      <DocSection id="types" title={t.typesTitle}>
        <p>
          <Rich>{t.typesLead()}</Rich>
        </p>
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

      <DocSection id="attributes" title={t.attrsTitle}>
        <p>
          <Rich>{t.attrsLead()}</Rich>
        </p>
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

      <DocSection id="empty" title={t.emptyTitle}>
        <p>
          <Rich>{t.emptyLead()}</Rich>
        </p>
        <List
          items={[
            t.emptyText,
            t.emptyCheckbox,
            t.emptyNothing,
            t.emptyUnselected,
            t.emptyStringbool,
            t.emptyGroup,
          ]}
        />
      </DocSection>

      <DocSection id="dropped" title={t.droppedTitle}>
        <p>
          <Rich>{t.droppedLead()}</Rich>
        </p>
        <List
          items={[
            t.droppedRefine,
            t.droppedExclusive,
            t.droppedRegex,
            t.droppedPattern,
            t.droppedMime,
            t.droppedFileSize,
            t.droppedDatetime,
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

      <DocSection id="refused" title={t.refusedTitle}>
        <p>
          <Rich>{t.refusedLead()}</Rich>
        </p>
        <List
          items={[
            t.refusedNumber,
            t.refusedShape,
            t.refusedNested,
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
