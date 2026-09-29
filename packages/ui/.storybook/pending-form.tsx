import type { FC, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

// action の Promise は play が finishPending を呼ぶまで解決しない。終わらない
// action のままにすると、React が後から始まる action を同じ送信中として束ね、
// 以降のストーリーの action も完了しなくなるので、見終わったら終わらせる
let finish = (): void => {};

export const finishPending = (): void => {
  finish();
};

const PendingNote: FC = () => {
  const { pending } = useFormStatus();
  return pending ? <p>送信中</p> : null;
};

/**
 * 送信すると finishPending を呼ぶまで送信中のままになるフォーム。送信中は
 * 「送信中」と出すので、play は findByText('送信中') で送信中になるのを待てる。
 */
export const PendingForm: FC<{ children: ReactNode }> = ({ children }) => (
  <form
    action={async () => {
      await new Promise<void>((resolve) => {
        finish = resolve;
      });
    }}
  >
    {children}
    <PendingNote />
  </form>
);
