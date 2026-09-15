import { formFields } from '@k8ordo/form/server';
import type { PageProps } from '@k8ordo/router';

import { Counter } from './_parts/counter';
import { listEntries } from './_parts/guestbook';
import { GuestbookForm } from './_parts/guestbook-form';
import { guestbookSchema } from './_parts/guestbook-schema';
import { leave } from './_parts/leave';

// スキーマから属性と文言を導くのは Server Component 側。モジュールスコープで
// 一度だけ導き、素の JSON として props でクライアントに渡す
const guestbookFields = formFields(guestbookSchema);

// request は server モードでだけ生成器が Register に書くので、この型は
// @k8ordo/static の下では request を持たず、読むページは型で落ちる
export default async function HomePage({ request }: PageProps<'/'>) {
  // サーバーモードなのでリクエストごとに読み直される
  const entries = await listEntries();
  return (
    <>
      <h1 data-testid="title">home</h1>
      <p data-testid="rendered-at">rendered on the server</p>
      <p data-testid="request">
        {`visitor:${request.cookies.get('visitor') ?? '-'} language:${request.headers.get('accept-language') ?? '-'}`}
      </p>
      <Counter />
      <GuestbookForm fields={guestbookFields} />
      <form action={leave} data-testid="leave-form">
        <button type="submit">leave</button>
      </form>
      <ul data-testid="entries">
        {entries.map((name, index) => (
          <li key={`${name}-${String(index)}`}>{name}</li>
        ))}
      </ul>
    </>
  );
}
