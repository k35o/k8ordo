'use client';

import { Fragment, useEffect, useEffectEvent, useState } from 'react';
import type { FC, FragmentInstance, ReactNode } from 'react';

export const Resize: FC<{
  children: ReactNode;
  onChange: () => void;
}> = ({ children, onChange }) => {
  const [instance, setInstance] = useState<FragmentInstance | null>(null);
  const handleChange = useEffectEvent(onChange);

  useEffect(() => {
    if (!instance) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      handleChange();
    });

    instance.observeUsing(observer);

    return () => {
      instance.unobserveUsing(observer);
      observer.disconnect();
    };
  }, [instance]);

  // ref を持つ Fragment は子を観測するための境界で、無駄な Fragment ではない。
  // このルールは Fragment の ref をまだ知らない。
  // oxlint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment ref={setInstance}>{children}</Fragment>;
};
