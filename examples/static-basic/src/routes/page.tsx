import { Counter } from './_parts/counter';

export default function HomePage() {
  return (
    <>
      <h1 data-testid="title">home</h1>
      <p data-testid="rendered-at">rendered on the server</p>
      <Counter />
    </>
  );
}
