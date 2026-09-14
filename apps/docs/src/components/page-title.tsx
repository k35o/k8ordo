import type { Message } from '@k8ordo/i18n';
import type { FC } from 'react';

type Props = { name: string } | { title: Message };

/**
 * ページの <title>。React 19 が木のどこにあっても head に持ち上げるので、
 * ページは見出しと同じ場所に書く。ルートレイアウトは title を持たない
 * （同時に画面にあるのは 1 つだけ、が規則）。
 */
export const PageTitle: FC<Props> = (props) => {
  const name = 'name' in props ? props.name : props.title();
  return <title>{`${name} · k8ordo`}</title>;
};
