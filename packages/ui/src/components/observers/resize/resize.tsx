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

  return <Fragment ref={setInstance}>{children}</Fragment>;
};
