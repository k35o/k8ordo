'use client';

import { matchPath, normalizePathname, usePathname } from '@k8ordo/router';
import type { MatchablePattern } from '@k8ordo/router';
import { Button, Code, FormControl, Switch, TextField } from '@k8ordo/ui';
import { useId, useState } from 'react';

import * as m from '../../../../../messages';

type Outcome =
  | { kind: 'match'; params: string }
  | { kind: 'miss' }
  | { kind: 'invalid' };

type Input = { pattern: string; pathname: string; inclusive: boolean };

const SECTION_PATTERN = '/:locale/router/*';

const EXAMPLES: readonly Input[] = [
  { pattern: '/products/:id', pathname: '/products/a%2Fb', inclusive: false },
  { pattern: '/products/:id', pathname: '/products/a/b', inclusive: false },
  { pattern: '/products', pathname: '/products///', inclusive: false },
  { pattern: '/products/*', pathname: '/products', inclusive: false },
  { pattern: '/products/*', pathname: '/products', inclusive: true },
];

const evaluate = ({ pattern, pathname, inclusive }: Input): Outcome => {
  try {
    // 試すパターンは任意の文字列で、このサイトの表のものとは限らない。
    // 生成された Register が型をサイトの表に絞っているので、ここでだけ広げる
    const params = matchPath(pattern as MatchablePattern, pathname, {
      inclusive,
    });
    return params === null
      ? { kind: 'miss' }
      : { kind: 'match', params: JSON.stringify(params) };
  } catch {
    // URLPattern が解釈できないパターンは TypeError になる
    return { kind: 'invalid' };
  }
};

const callOf = ({ pattern, pathname, inclusive }: Input): string =>
  `matchPath('${pattern}', '${pathname}'${inclusive ? ', { inclusive: true }' : ''})`;

export function MatchPlayground() {
  const current = usePathname();
  const [input, setInput] = useState<Input>({
    pattern: SECTION_PATTERN,
    pathname: current,
    inclusive: false,
  });
  const outcome = evaluate(input);
  const examplesId = useId();

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormControl
          label={m.routerLinks.demo.pattern()}
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
          label={m.routerLinks.demo.pathname()}
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
      <Switch
        checked={input.inclusive}
        label={m.routerLinks.demo.inclusive()}
        onChange={(checked) => {
          setInput({ ...input, inclusive: checked });
        }}
      />
      <div
        aria-labelledby={examplesId}
        className="flex flex-wrap items-center gap-2"
        role="group"
      >
        <span className="text-fg-mute text-sm" id={examplesId}>
          {m.routerLinks.demo.examples()}
        </span>
        <Button
          color="base"
          onClick={() => {
            setInput({
              pattern: SECTION_PATTERN,
              pathname: current,
              inclusive: false,
            });
          }}
          size="sm"
          variant="outline"
        >
          {m.routerLinks.demo.reset()}
        </Button>
        {EXAMPLES.map((example) => (
          <Button
            color="base"
            key={callOf(example)}
            onClick={() => {
              setInput(example);
            }}
            size="sm"
            variant="outline"
          >
            {`${example.pattern} · ${example.pathname}${example.inclusive ? ' · inclusive' : ''}`}
          </Button>
        ))}
      </div>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-fg-mute">{m.routerLinks.demo.call()}</dt>
          <dd className="break-all">
            <Code>{callOf(input)}</Code>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-fg-mute">{m.routerLinks.demo.normalized()}</dt>
          <dd className="break-all">
            <Code>{normalizePathname(input.pathname)}</Code>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-fg-mute">{m.routerLinks.demo.result()}</dt>
          <dd aria-live="polite" className="break-all">
            {outcome.kind === 'match' && <Code>{outcome.params}</Code>}
            {outcome.kind === 'miss' && (
              <>
                <Code>null</Code>{' '}
                <span className="text-fg-mute">
                  {m.routerLinks.demo.miss()}
                </span>
              </>
            )}
            {outcome.kind === 'invalid' && (
              <span className="text-fg-error">
                {m.routerLinks.demo.invalid()}
              </span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
