'use client';

import { matchPath, usePathname } from '@k8ordo/framework';
import type { MatchablePattern } from '@k8ordo/framework';
import { Button, Code, FormControl, Switch, TextField } from '@k8ordo/ui';
import { useState } from 'react';

import { jsLiteral } from '../../../components/js-literal';
import * as m from '../../../messages';

type Outcome =
  | { kind: 'match'; params: string }
  | { kind: 'miss' }
  | { kind: 'invalid' };

type Input = { pattern: string; pathname: string; inclusive: boolean };

const SECTION_PATTERN = '/:locale/router/*';

const evaluate = ({ pattern, pathname, inclusive }: Input): Outcome => {
  try {
    // 試すパターンは読者が書く任意の文字列で、このサイトの表のものとは
    // 限らない。生成された Register が型をサイトの表に絞っているので、
    // ここでだけ広げる
    const params = matchPath(pattern as MatchablePattern, pathname, {
      inclusive,
    });
    return params === null
      ? { kind: 'miss' }
      : { kind: 'match', params: jsLiteral(params) };
  } catch {
    // URLPattern が解釈できないパターンは TypeError になる
    return { kind: 'invalid' };
  }
};

const callOf = ({ pattern, pathname, inclusive }: Input): string =>
  `matchPath('${pattern}', '${pathname}'${inclusive ? ', { inclusive: true }' : ''})`;

export function MatchDemo() {
  const current = usePathname();
  const initial: Input = {
    pattern: SECTION_PATTERN,
    pathname: current,
    inclusive: false,
  };
  const [input, setInput] = useState<Input>(initial);
  const outcome = evaluate(input);

  return (
    <div className="flex flex-col gap-6">
      <p className="flex flex-wrap items-baseline gap-2 text-sm">
        <span className="text-fg-mute">{m.routerLocation.demoCurrent()}</span>
        <Code>{current}</Code>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormControl
          label={m.routerLocation.demoPattern()}
          renderInput={(props) => (
            <TextField
              {...props}
              autoComplete="off"
              onChange={(event) => {
                setInput({ ...input, pattern: event.target.value });
              }}
              spellCheck={false}
              value={input.pattern}
            />
          )}
        />
        <FormControl
          label={m.routerLocation.demoPath()}
          renderInput={(props) => (
            <TextField
              {...props}
              autoComplete="off"
              onChange={(event) => {
                setInput({ ...input, pathname: event.target.value });
              }}
              spellCheck={false}
              value={input.pathname}
            />
          )}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Switch
          checked={input.inclusive}
          label={m.routerLocation.demoInclusive()}
          onChange={(checked) => {
            setInput({ ...input, inclusive: checked });
          }}
        />
        <Button
          color="base"
          onClick={() => {
            setInput(initial);
          }}
          size="sm"
          variant="outline"
        >
          {m.routerLocation.demoReset()}
        </Button>
      </div>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-fg-mute">{m.routerLocation.demoCall()}</dt>
          <dd className="break-all">
            <Code>{callOf(input)}</Code>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-fg-mute">{m.routerLocation.demoResult()}</dt>
          <dd aria-live="polite" className="break-all">
            {outcome.kind === 'match' && <Code>{outcome.params}</Code>}
            {outcome.kind === 'miss' && (
              <>
                <Code>null</Code>{' '}
                <span className="text-fg-mute">
                  {m.routerLocation.demoMiss()}
                </span>
              </>
            )}
            {outcome.kind === 'invalid' && (
              <span className="text-fg-error">
                {m.routerLocation.demoInvalid()}
              </span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
