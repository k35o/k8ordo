import { touch } from '../lib/actions';

export default function HomePage() {
  return (
    <>
      <title>home</title>
      <h1>home</h1>
      <form action={touch}>
        <button type="submit">touch</button>
      </form>
    </>
  );
}
