import { waitUntil } from '../../../../../src/runtime/server';

export default function RenderedPage() {
  waitUntil(Promise.resolve('counted'));
  return <h1>rendered</h1>;
}
