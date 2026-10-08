'use client';

import { Button } from '@k8ordo/ui';
import { useState } from 'react';

function Thrower({ armed }: { armed: boolean }) {
  if (armed) {
    throw new Error('thrown on purpose by the error.tsx demo');
  }
  return null;
}

/**
 * Throws while rendering once pressed, so the site's real
 * `routes/[locale]/error.tsx` takes the page's place. The label is a string
 * rather than a message: a function does not cross from the page to here.
 */
export function ErrorDemo({ label }: { label: string }) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="flex">
      <Button
        color="base"
        onClick={() => {
          setArmed(true);
        }}
        variant="outline"
      >
        {label}
      </Button>
      <Thrower armed={armed} />
    </div>
  );
}
