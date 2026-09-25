import { Code, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import { en, ja } from '@k8ordo/ui/i18n';
import type { Messages } from '@k8ordo/ui/i18n';

import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

/** 辞書のキーが増減したらここも直すよう、Record で網羅性を型に持たせる */
const MESSAGE_USAGE = {
  close: 'Alert / Dialog / Drawer / Response',
  required: 'FormControl',
  loading: 'Spinner',
  avatar: 'Avatar',
  color: 'Code',
  alertSuccess: 'Alert',
  alertInfo: 'Alert',
  alertWarning: 'Alert',
  alertError: 'Alert',
  toastRegion: 'Toast',
  copy: 'CopyButton',
  copied: 'CopyButton / CodeBlock',
  copyFailed: 'CopyButton / CodeBlock',
  autocompletePlaceholder: 'Autocomplete',
  autocompleteRemoveTag: 'Autocomplete',
  autocompleteClear: 'Autocomplete',
  autocompleteEmpty: 'Autocomplete',
  fileFieldRemove: 'FileField',
  fileFieldTrigger: 'FileField.Dropzone / FileField（生成 UI）',
  fileFieldDrop: 'FileField.Dropzone',
  numberFieldIncrement: 'NumberField',
  numberFieldDecrement: 'NumberField',
  numberFieldRangeUnderflow: 'NumberField',
  numberFieldRangeOverflow: 'NumberField',
  calendarPreviousMonth: 'Calendar / DatePicker',
  calendarNextMonth: 'Calendar / DatePicker',
  datePickerOpen: 'DatePicker',
  datePickerDialog: 'DatePicker',
  passwordShow: 'PasswordInput',
  passwordHide: 'PasswordInput',
  listBoxPlaceholder: 'ListBox',
  breadcrumb: 'Breadcrumb',
  tabList: 'Tabs（生成 UI）',
  paginationLabel: 'Pagination',
  paginationPrevious: 'Pagination',
  paginationNext: 'Pagination',
  dataTableColumns: 'DataTable',
  dataTableSelectAll: 'DataTable',
  dataTableSelectRow: 'DataTable',
  codeBlockCopy: 'CodeBlock',
  carousel: 'Carousel',
  carouselSlide: 'Carousel.Slide',
  carouselPrevious: 'Carousel',
  carouselNext: 'Carousel',
  chat: 'Conversation.Messages',
  scrollToLatest: 'Conversation.ScrollButton',
  reasoning: 'Reasoning',
  reasoningStreaming: 'Reasoning',
  suggestions: 'Suggestion.List',
  send: 'PromptInput',
  stop: 'PromptInput',
  toolInput: 'ToolInvocation',
  toolOutput: 'ToolInvocation',
  toolError: 'ToolInvocation',
  toolDenied: 'ToolInvocation',
  responseCopied: 'Response',
  responseCopyCode: 'Response',
  responseCopyLink: 'Response',
  responseCopyTable: 'Response',
  responseCopyTableAsCsv: 'Response',
  responseCopyTableAsMarkdown: 'Response',
  responseCopyTableAsTsv: 'Response',
  responseDownloadDiagram: 'Response',
  responseDownloadDiagramAsMmd: 'Response',
  responseDownloadDiagramAsPng: 'Response',
  responseDownloadDiagramAsSvg: 'Response',
  responseDownloadFile: 'Response',
  responseDownloadImage: 'Response',
  responseDownloadTable: 'Response',
  responseDownloadTableAsCsv: 'Response',
  responseDownloadTableAsMarkdown: 'Response',
  responseExitFullscreen: 'Response',
  responseViewFullscreen: 'Response',
  responseImageNotAvailable: 'Response',
  responseOpenExternalLink: 'Response',
  responseExternalLinkWarning: 'Response',
  responseOpenLink: 'Response',
} as const satisfies Record<keyof Messages, string>;

type MessageRow = {
  key: keyof Messages;
  usedBy: string;
  jaValue: string;
  enValue: string;
};

const MESSAGE_ROWS: readonly MessageRow[] =
  // Object.keys は string[] を返すため、辞書の添字に使えるよう絞り込む
  (Object.keys(MESSAGE_USAGE) as Array<keyof Messages>).map((key) => ({
    key,
    usedBy: MESSAGE_USAGE[key],
    jaValue: ja[key],
    enValue: en[key],
  }));

export default function I18n() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle title={m.nav.i18n} />
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <Rich>{m.nav.i18n()}</Rich>
        </Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.uiI18n.introduction()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.localeTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.localeDescription()}</Rich>
        </p>
        <CodeBlock
          code={`// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  en: { timeZone: 'UTC', dir: 'ltr' },
});`}
          lang="ts"
        />
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.clientGraph()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.englishTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.englishDescription()}</Rich>
        </p>
        <CodeBlock
          code={`// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
});`}
          lang="ts"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.registerTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.registerDescription()}</Rich>
        </p>
        <CodeBlock
          code={`// src/ui-messages/fr.ts
import type { Messages } from '@k8ordo/ui/i18n';

export const fr: Messages = {
  close: 'Fermer',
  required: 'Requis',
  loading: 'Chargement',
  // ...
};

// src/i18n.ts
import { defineLocales } from '@k8ordo/i18n';
import { registerMessages } from '@k8ordo/ui/i18n';

import { fr } from './ui-messages/fr';

export const locales = defineLocales({
  ja: { timeZone: 'Asia/Tokyo', dir: 'ltr' },
  fr: { timeZone: 'Europe/Paris', dir: 'ltr' },
});

registerMessages('fr', fr);`}
          lang="ts"
        />
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.regional()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.overrideTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.overrideDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { en, ja, registerMessages } from '@k8ordo/ui/i18n';

registerMessages('ja', { ...ja, close: '閉じる (Esc)' });
registerMessages('en', { ...en, autocompleteEmpty: 'No matches' });`}
          lang="ts"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.priorityTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.priorityDescription()}</Rich>
        </p>
        <CodeBlock
          code={`// 1. prop
<Spinner label="送信中" />
// -> 送信中

// 2. registerMessages('ja', { ...ja, loading: 'ロード中' })
<Spinner />
// -> ロード中

// 3. built-in
<Spinner />
// -> 読み込み中`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.readTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.readDescription()}</Rich>
        </p>
        <CodeBlock
          code={`import { getMessages } from '@k8ordo/ui/i18n';

function DismissButton({ onDismiss }) {
  const { close } = getMessages();
  return (
    <button aria-label={close} onClick={onDismiss} type="button">
      ×
    </button>
  );
}`}
          lang="tsx"
        />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.serverTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.serverDescription()}</Rich>
        </p>
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.migrationTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.migrationDescription()}</Rich>
        </p>
        <ol className="text-fg-mute flex flex-col gap-2 pl-6">
          <li className="list-decimal">
            <Rich>{m.uiI18n.migrationProvider()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{m.uiI18n.migrationLocale()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{m.uiI18n.migrationRegister()}</Rich>
          </li>
          <li className="list-decimal">
            <Rich>{m.uiI18n.migrationRead()}</Rich>
          </li>
        </ol>
        <CodeBlock code="<UIProvider>{children}</UIProvider>" lang="tsx" />
      </section>

      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.uiI18n.keysTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute">
          <Rich>{m.uiI18n.keysDescription()}</Rich>
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
                <span className="text-fg-mute/60">
                  <Rich>{m.uiI18n.usedByColumn()}</Rich>:{' '}
                </span>
                {row.usedBy}
              </dd>
              <dd className="text-fg-mute text-sm">
                <span className="text-fg-mute/60">
                  <Rich>{m.uiI18n.jaColumn()}</Rich>:{' '}
                </span>
                {row.jaValue}
              </dd>
              <dd className="text-fg-mute text-sm">
                <span className="text-fg-mute/60">
                  <Rich>{m.uiI18n.enColumn()}</Rich>:{' '}
                </span>
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
                  <Rich>{m.uiI18n.keyColumn()}</Rich>
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  <Rich>{m.uiI18n.usedByColumn()}</Rich>
                </th>
                <th className="py-3 pr-6 font-medium whitespace-nowrap">
                  <Rich>{m.uiI18n.jaColumn()}</Rich>
                </th>
                <th className="py-3 font-medium whitespace-nowrap">
                  <Rich>{m.uiI18n.enColumn()}</Rich>
                </th>
              </tr>
            </thead>
            <tbody className="text-fg-mute">
              {MESSAGE_ROWS.map((row) => (
                <tr className="border-border-mute border-b" key={row.key}>
                  <td className="py-3 pr-6 whitespace-nowrap">
                    <Code>{row.key}</Code>
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap">{row.usedBy}</td>
                  <td className="py-3 pr-6">{row.jaValue}</td>
                  <td className="py-3">{row.enValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
