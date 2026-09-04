import { Counter } from './_parts/counter';
import { listEntries } from './_parts/guestbook';
import { GuestbookForm } from './_parts/guestbook-form';

export default async function HomePage() {
  // サーバーモードなのでリクエストごとに読み直される
  const entries = await listEntries();
  return (
    <>
      <h1 data-testid="title">home</h1>
      <p data-testid="rendered-at">rendered on the server</p>
      <Counter />
      <GuestbookForm />
      <ul data-testid="entries">
        {entries.map((name, index) => (
          <li key={`${name}-${String(index)}`}>{name}</li>
        ))}
      </ul>
    </>
  );
}
