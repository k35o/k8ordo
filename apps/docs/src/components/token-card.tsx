'use client';

import type { Message } from '@k8ordo/i18n';

import * as m from '../messages';
import type { SemanticToken } from '../theme/design-tokens';

import styles from './token-card.module.css';

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
    // 白いページの上に白いカードを置くと、ダークでは影が見えずに地に溶けるので、ページの地の面にする
    <div className={styles.card}>
      <div className={styles.body}>
        <div
          className={styles.swatch}
          style={
            type === 'border'
              ? { border: `2px solid var(--${token.name})` }
              : { backgroundColor: `var(--${token.name})` }
          }
        />
        <div className={styles.text}>
          <p className={styles.name}>{token.name}</p>
          <p className={styles.values}>
            Light <span className={styles.value}>{token.light}</span>
            {' · '}
            Dark <span className={styles.value}>{token.dark}</span>
          </p>
          {description === null ? null : (
            <p className={styles.description}>{description()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
