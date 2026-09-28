import type { FC, HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

// 組版はすべて base.css の .ao-prose にある。子孫の要素ごとに効かせるので
// ユーティリティのクラスでは書けない
export const Prose: FC<Props> = ({ children, ...rest }) => (
  <div {...rest} className="ao-prose">
    {children}
  </div>
);
