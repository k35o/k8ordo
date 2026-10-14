'use client';

import { parseAcceptLanguage } from '@k8ordo/i18n';
import { Badge, Button, Code, FormControl, TextField } from '@k8ordo/ui';
import { useId, useState } from 'react';

import { Rich } from '../../../components/rich';
import { locales } from '../../../i18n';
import type { Locale } from '../../../i18n';
import * as m from '../../../messages';

import styles from './negotiation-demo.module.css';

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
  const text = m.i18nNegotiate;
  if (!consulted) {
    return (
      <Badge label={text.demoNotConsulted()} size="sm" variant="outline" />
    );
  }
  if (step.kind === 'exact') {
    return (
      <Badge label={text.demoExact(step.locale)} size="sm" tone="success" />
    );
  }
  if (step.kind === 'language') {
    return (
      <Badge label={text.demoLanguage(step.locale)} size="sm" tone="info" />
    );
  }
  if (step.kind === 'invalid') {
    return <Badge label={text.demoInvalid()} size="sm" tone="warning" />;
  }
  return <Badge label={text.demoNone()} size="sm" />;
}

export function NegotiationDemo() {
  const text = m.i18nNegotiate;
  const presetsId = useId();
  const [header, setHeader] = useState<string>(PRESETS[0]);
  const requested = parseAcceptLanguage(header);
  const steps = requested.map((tag) => ({ tag, step: stepFor(tag) }));
  const decidedAt = steps.findIndex(({ step }) => decides(step));
  const answer = locales.negotiate(requested);

  return (
    <div className={styles.root}>
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
      <div className={styles.group}>
        <span className={styles.label} id={presetsId}>
          {text.demoPresets()}
        </span>
        <div
          aria-labelledby={presetsId}
          className={styles.presets}
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
            {text.demoBrowser()}
          </Button>
        </div>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>
          <Rich>{text.demoParsed()}</Rich>
        </span>
        {steps.length === 0 ? (
          <p className={styles.empty}>{text.demoEmpty()}</p>
        ) : (
          <ol className={styles.steps}>
            {steps.map(({ tag, step }, index) => (
              <li
                className={styles.step}
                // ヘッダーは同じタグを何度でも並べられるので、位置が同一性になる
                key={`${String(index)}:${tag}`}
              >
                <span className={styles.stepBody}>
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
      <div aria-live="polite" className={styles.answer}>
        <span className={styles.label}>
          <Rich>{text.demoAnswer()}</Rich>
        </span>
        <p className={styles.answerValue}>
          <Code>{answer}</Code>
          {decidedAt === -1 && (
            <span className={styles.fellBack}>{text.demoFellBack()}</span>
          )}
        </p>
      </div>
    </div>
  );
}
