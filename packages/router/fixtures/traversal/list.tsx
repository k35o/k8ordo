import { useLayoutEffect, useRef } from 'react';
import type { FC, ReactNode } from 'react';

// 描くたびに自分の高さを layout effect で測る部品。@k8ordo/ui の Tabs の
// useWritingMode のように、ページを画面に出す commit の中で layout を強制する
export const Measured: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (element !== null) {
      element.dataset.height = String(element.getBoundingClientRect().height);
    }
  });
  return <div ref={ref}>{children}</div>;
};

const ITEMS = Array.from({ length: 90 }, (_, index) => index);

export const List: FC<{ few: boolean }> = ({ few }) => {
  const items = few ? ITEMS.filter((i) => i % 3 === 0) : ITEMS;
  return (
    <>
      <p data-testid="count">{items.length}</p>
      <Measured>
        <ul style={{ margin: 0, padding: 0 }}>
          {items.map((i) => (
            <li key={i} style={{ height: '100px', listStyle: 'none' }}>
              {i}
            </li>
          ))}
        </ul>
      </Measured>
    </>
  );
};
