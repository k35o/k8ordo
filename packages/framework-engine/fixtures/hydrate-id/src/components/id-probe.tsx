'use client';

import { useId } from 'react';

// hydrate は HTML の属性を直さないので、id には HTML の値が残る。ブラウザの
// React が持つ値は、hydrate で付く ref から別の属性に書く
export function IdProbe({ name }: { name: string }) {
  const id = useId();
  return (
    <p
      id={id}
      ref={(node) => {
        if (node !== null) node.dataset.hydratedId = id;
      }}
    >
      {name}
    </p>
  );
}
