'use client';

import { nothingHere } from '../messages/not-found';

// Server Component の文言はビルドが書いたまま。ブラウザが描き直すのは
// Client Component の文言だけ
export function NothingHere() {
  return <p data-testid="nothing-here">{nothingHere()}</p>;
}
