'use client';

import type { Message } from '@k8ordo/i18n';

import * as m from '../messages';
import type { SemanticToken } from '../theme/design-tokens';

// 説明の無いトークンもあるので、文言があるかで決める。
const descriptionOf = (name: string): Message | null =>
  Object.hasOwn(m.theming.token, name)
    ? m.theming.token[name as keyof typeof m.theming.token]
    : null;

export function TokenCard({
  token,
  type = 'fill',
}: {
  token: SemanticToken;
  type?: 'fill' | 'border';
}) {
  const description = descriptionOf(token.name);

  return (
    // 本文の白いカードの中に置くので、白いカードを重ねず、ページの地の面にする
    <div className="bg-bg-surface rounded-xl">
      <div className="flex items-start gap-3 p-4">
        <div
          className="ring-border-mute mt-0.5 size-6 shrink-0 rounded-md ring-1"
          style={
            type === 'border'
              ? { border: `2px solid var(--${token.name})` }
              : { backgroundColor: `var(--${token.name})` }
          }
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-medium">{token.name}</p>
          <p className="text-fg-subtle text-xs">
            Light <span className="text-fg-mute">{token.light}</span>
            {' · '}
            Dark <span className="text-fg-mute">{token.dark}</span>
          </p>
          {description === null ? null : (
            <p className="text-fg-mute text-xs leading-relaxed">
              {description()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
