import { Code } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import { en, ja, messageUsage } from '@k8ordo/ui/i18n';
import type { Messages } from '@k8ordo/ui/i18n';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

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

import * as m from '../messages';

export function AddToCart() {
  return <Button>{m.cart.add()}</Button>;
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
        <dl className="flex flex-col gap-4 md:hidden">
          {MESSAGE_ROWS.map((row) => (
            <div
              className="border-border-mute flex flex-col gap-1 border-b pb-4"
              key={row.key}
            >
              <dt className="font-medium">
                <Code>{row.key}</Code>
              </dt>
              <dd className="text-fg-mute text-sm">
                {t.usedByColumn()}
                {m.docPage.termSeparator()}
                {row.usedBy}
              </dd>
              <dd className="text-fg-mute text-sm">
                {t.jaColumn()}
                {m.docPage.termSeparator()}
                {row.jaValue}
              </dd>
              <dd className="text-fg-mute text-sm">
                {t.enColumn()}
                {m.docPage.termSeparator()}
                {row.enValue}
              </dd>
            </div>
          ))}
        </dl>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border-mute border-b">
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  {t.keyColumn()}
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  {t.usedByColumn()}
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  {t.jaColumn()}
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  {t.enColumn()}
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {MESSAGE_ROWS.map((row) => (
                <tr className="border-border-mute border-b" key={row.key}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{row.key}</Code>
                  </td>
                  <td className="py-3 pr-6">{row.usedBy}</td>
                  <td className="py-3 pr-6">{row.jaValue}</td>
                  <td className="py-3">{row.enValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
    </DocPage>
  );
}
