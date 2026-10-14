import { Code } from '@k8ordo/ui';
import { en, ja, messageUsage } from '@k8ordo/ui/i18n';
import type { Messages } from '@k8ordo/ui/i18n';

import { Pitfall } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

import page from '../../../../styles/page.module.css';
import styles from '../../../../styles/pages/ui/i18n.module.css';

const t = m.uiI18n;

type MessageRow = {
  key: keyof Messages;
  usedBy: string;
  jaValue: string;
  enValue: string;
};

const MESSAGE_ROWS: readonly MessageRow[] =
  // Object.keys は string[] を返すため、辞書の添字に使えるよう絞り込む
  (Object.keys(messageUsage) as Array<keyof Messages>).map((key) => ({
    key,
    usedBy: messageUsage[key].join(' / '),
    jaValue: ja[key],
    enValue: en[key],
  }));

const LOCALES = `import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});`;

const JAPANESE_ONLY = `import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
});`;

const FRENCH = `import type { Messages } from '@k8ordo/ui/i18n';

export const fr: Messages = {
  close: 'Fermer',
  required: 'Requis',
  loading: 'Chargement',
  // ...
};`;

const REGISTER = `import { defineLocales } from '@k8ordo/i18n';
import { registerMessages } from '@k8ordo/ui/i18n';

import { fr } from './messages/ui-fr';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  fr: { timeZone: 'Europe/Paris', dir: 'ltr' },
});

registerMessages('fr', fr);`;

const OVERRIDE = `import { en, ja, registerMessages } from '@k8ordo/ui/i18n';

registerMessages('ja', { ...ja, close: '閉じる (Esc)' });
registerMessages('en', { ...en, autocompleteEmpty: 'No matches' });`;

const READ = `import { getMessages } from '@k8ordo/ui/i18n';

export function DismissButton({ onDismiss }) {
  const { close } = getMessages();
  return (
    <button aria-label={close} onClick={onDismiss} type="button">
      ×
    </button>
  );
}`;

const PROPS = `import { Button } from '@k8ordo/ui';

import { add } from '../messages/cart';

export function AddToCart() {
  return <Button>{add()}</Button>;
}`;

export default function UiI18nPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/ui/i18n">
      <DocSection id="locale" title={t.localeTitle}>
        <CodeBlock code={LOCALES} lang="ts" title="src/i18n.ts" />
        <p>
          <Rich>{t.localeSet()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.clientGraph()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="english" title={t.englishTitle}>
        <CodeBlock code={JAPANESE_ONLY} lang="ts" title="src/i18n.ts" />
        <p>
          <Rich>{t.englishJapanese()}</Rich>
        </p>
        <p>
          <Rich>{t.englishFallback()}</Rich>
        </p>
      </DocSection>

      <DocSection id="register" title={t.registerTitle}>
        <CodeBlock code={FRENCH} lang="ts" title="src/messages/ui-fr.ts" />
        <p>
          <Rich>{t.registerDictionary()}</Rich>
        </p>
        <CodeBlock
          code={REGISTER}
          lang="ts"
          marks={{ 11: 'highlight' }}
          title="src/i18n.ts"
        />
        <p>
          <Rich>{t.registerWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.regional()}</Rich>
        </p>
      </DocSection>

      <DocSection id="override" title={t.overrideTitle}>
        <CodeBlock code={OVERRIDE} lang="ts" title="src/i18n.ts" />
        <p>
          <Rich>{t.overrideSpread()}</Rich>
        </p>
      </DocSection>

      <DocSection id="priority" title={t.priorityTitle}>
        <p>
          <Rich>{t.priorityOrder()}</Rich>
        </p>
        <ol>
          <li>
            <Rich>{t.priorityProp()}</Rich>
          </li>
          <li>
            <Rich>{t.priorityRegistered()}</Rich>
          </li>
          <li>
            <Rich>{t.priorityBuiltIn()}</Rich>
          </li>
        </ol>
        <p>
          <Rich>{t.priorityHint()}</Rich>
        </p>
      </DocSection>

      <DocSection id="read" title={t.readTitle}>
        <CodeBlock code={READ} lang="tsx" title="dismiss-button.tsx" />
        <p>
          <Rich>{t.readFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.readAligned()}</Rich>
        </p>
      </DocSection>

      <DocSection id="props" title={t.propsTitle}>
        <CodeBlock
          code={PROPS}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/components/add-to-cart.tsx"
        />
        <p>
          <Rich>{t.propsString()}</Rich>
          <LocaleAnchor path="/:locale/i18n/messages">
            {m.i18n.navMessages()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="keys" title={t.keysTitle}>
        <p>
          <Rich>{t.keysAll()}</Rich>
        </p>
        <dl className={styles.list}>
          {MESSAGE_ROWS.map((row) => (
            <div className={styles.entry} key={row.key}>
              <dt className={styles.term}>
                <Code>{row.key}</Code>
              </dt>
              <dd className={styles.detail}>
                {t.usedByColumn()}
                {m.docPage.termSeparator()}
                {row.usedBy}
              </dd>
              <dd className={styles.detail}>
                {t.jaColumn()}
                {m.docPage.termSeparator()}
                {row.jaValue}
              </dd>
              <dd className={styles.detail}>
                {t.enColumn()}
                {m.docPage.termSeparator()}
                {row.enValue}
              </dd>
            </div>
          ))}
        </dl>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.row}>
                <th className={styles.columnHeader}>{t.keyColumn()}</th>
                <th className={styles.columnHeader}>{t.usedByColumn()}</th>
                <th className={styles.columnHeader}>{t.jaColumn()}</th>
                <th className={styles.lastColumnHeader}>{t.enColumn()}</th>
              </tr>
            </thead>
            <tbody className={page.mute}>
              {MESSAGE_ROWS.map((row) => (
                <tr className={styles.row} key={row.key}>
                  <td className={styles.keyCell}>
                    <Code>{row.key}</Code>
                  </td>
                  <td className={styles.cell}>{row.usedBy}</td>
                  <td className={styles.cell}>{row.jaValue}</td>
                  <td className={styles.lastCell}>{row.enValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
    </DocPage>
  );
}
