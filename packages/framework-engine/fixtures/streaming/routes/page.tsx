import { touch } from '../lib/actions';

export default function HomePage() {
  return (
    <>
      <h1>home</h1>
      <form action={touch}>
        <button type="submit">touch</button>
      </form>
    </>
  );
}
