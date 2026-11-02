import type { ReactNode } from 'react';

import { SERVER_STYLESHEETS, STYLESHEET_ORDER_HREF } from './payload';

/**
 * What the HTML render and the browser both render at the root, around the
 * application. `useId` derives an id from where its component sits among its
 * siblings all the way up, so a sibling only one side rendered here would
 * give every id below another value in the browser than in the HTML, whose
 * attributes hydration keeps.
 */
export function DocumentRoot({
  children,
  styleNonce,
}: {
  children: ReactNode;
  /** The HTML render's, under a server. The browser finds the style written. */
  styleNonce?: string | undefined;
}): ReactNode {
  return (
    <>
      {/* React は precedence の組を最初に頼まれた順に並べ、static は描く前に
          client 参照の CSS を頼む。遷移で読む client の CSS は head の末尾に、
          Server Component の CSS は同じ組の最後の後ろに入るので、その組を
          children より先に頼めば、どの開き方でも Server Component の CSS が
          先になる */}
      <style
        href={STYLESHEET_ORDER_HREF}
        precedence={SERVER_STYLESHEETS}
        nonce={styleNonce}
      />
      {children}
    </>
  );
}
