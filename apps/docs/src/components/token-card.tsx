'use client';

import { Card } from '@k8ordo/ui';

import { useTranslation } from '../i18n';
import type { MessageKey } from '../i18n/types';
import { MESSAGE_KEYS } from '../i18n/types';
import type { SemanticToken } from '../theme/design-tokens';

const descriptionKey = (name: string): MessageKey | null => {
  const key = `theming.token.${name}`;
  return (MESSAGE_KEYS as readonly string[]).includes(key)
    ? (key as MessageKey)
    : null;
};

export function TokenCard({
  token,
  type = 'fill',
}: {
  token: SemanticToken;
  type?: 'fill' | 'border';
}) {
  const { t } = useTranslation();
  const descKey = descriptionKey(token.name);

  return (
    <Card variant="shadow">
      <div className="flex items-start gap-3 p-4">
        <div
          className="mt-0.5 size-6 shrink-0 rounded-md"
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
          {descKey === null ? null : (
            <p className="text-fg-mute text-xs leading-relaxed">{t(descKey)}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
