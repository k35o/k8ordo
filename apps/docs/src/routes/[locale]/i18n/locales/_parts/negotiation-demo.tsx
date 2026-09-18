'use client';

import { parseAcceptLanguage } from '@k8ordo/i18n';
import { Badge, Button, Code, FormControl, TextField } from '@k8ordo/ui';
import { useId, useState } from 'react';

import { Rich } from '../../../../../components/rich';
import { locales } from '../../../../../i18n';
import type { Locale } from '../../../../../i18n';
import * as m from '../../../../../messages';

const PRESETS = [
  'fr-CH, fr;q=0.9, en-US;q=0.8, ja;q=0.7',
  'en-US, ja',
  'en_US, ja;q=0.5',
  '*;q=0.5, en;q=0, de',
] as const;

type Step =
  | { kind: 'exact' | 'language'; locale: Locale }
  | { kind: 'invalid' | 'none' };

const languageOf = (tag: string): string | null => {
  try {
    return new Intl.Locale(tag).language;
  } catch {
    return null;
  }
};

// 答えそのものは locales.negotiate が出す。ここはタグごとの「なぜ」を
// 見せるためだけに、同じ規則（完全一致 → 言語 → 飛ばす）で分類する。
const stepFor = (tag: string): Step => {
  const exact = locales.all.find(
    (locale) => locale.toLowerCase() === tag.toLowerCase(),
  );
  if (exact !== undefined) return { kind: 'exact', locale: exact };
  const language = languageOf(tag);
  if (language === null) return { kind: 'invalid' };
  const spoken = locales.all.find((locale) => languageOf(locale) === language);
  return spoken === undefined
    ? { kind: 'none' }
    : { kind: 'language', locale: spoken };
};

const decides = (step: Step): boolean =>
  step.kind === 'exact' || step.kind === 'language';

function StepBadge({ step, consulted }: { step: Step; consulted: boolean }) {
  const text = m.i18nLocales.demo;
  if (!consulted) {
    return <Badge label={text.notConsulted()} size="sm" variant="outline" />;
  }
  if (step.kind === 'exact') {
    return <Badge label={text.exact(step.locale)} size="sm" tone="success" />;
  }
  if (step.kind === 'language') {
    return <Badge label={text.language(step.locale)} size="sm" tone="info" />;
  }
  if (step.kind === 'invalid') {
    return <Badge label={text.invalid()} size="sm" tone="warning" />;
  }
  return <Badge label={text.none()} size="sm" />;
}

export function NegotiationDemo() {
  const text = m.i18nLocales.demo;
  const presetsId = useId();
  const [header, setHeader] = useState<string>(PRESETS[0]);
  const requested = parseAcceptLanguage(header);
  const steps = requested.map((tag) => ({ tag, step: stepFor(tag) }));
  const decidedAt = steps.findIndex(({ step }) => decides(step));
  const answer = locales.negotiate(requested);

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <FormControl
        label="Accept-Language"
        renderInput={(props) => (
          <TextField
            {...props}
            autoComplete="off"
            onChange={(event) => {
              setHeader(event.currentTarget.value);
            }}
            spellCheck={false}
            value={header}
          />
        )}
      />
      <div className="flex flex-col gap-2">
        <span className="text-fg-mute text-sm" id={presetsId}>
          {text.presets()}
        </span>
        <div
          aria-labelledby={presetsId}
          className="flex flex-wrap gap-2"
          role="group"
        >
          {PRESETS.map((preset) => (
            <Button
              color="base"
              key={preset}
              onClick={() => {
                setHeader(preset);
              }}
              size="sm"
              variant="outline"
            >
              {preset}
            </Button>
          ))}
          <Button
            color="base"
            onClick={() => {
              setHeader(navigator.languages.join(', '));
            }}
            size="sm"
            variant="outline"
          >
            {text.useBrowser()}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-fg-mute text-sm">
          <Rich>{text.parsed()}</Rich>
        </span>
        {steps.length === 0 ? (
          <p className="text-fg-mute text-sm">{text.empty()}</p>
        ) : (
          <ol className="flex flex-col gap-2 pl-6 text-sm">
            {steps.map(({ tag, step }, index) => (
              <li
                className="list-decimal"
                // ヘッダーは同じタグを何度でも並べられるので、位置が同一性になる
                key={`${String(index)}:${tag}`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <Code>{tag}</Code>
                  <StepBadge
                    consulted={decidedAt === -1 || index <= decidedAt}
                    step={step}
                  />
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div aria-live="polite" className="flex flex-col gap-1">
        <span className="text-fg-mute text-sm">
          <Rich>{text.answer()}</Rich>
        </span>
        <p className="flex flex-wrap items-center gap-2 text-lg">
          <Code>{answer}</Code>
          {decidedAt === -1 && (
            <span className="text-fg-mute text-sm">{text.fellBack()}</span>
          )}
        </p>
      </div>
    </div>
  );
}
