import type { ReactNode } from 'react';

import { Holder } from '../../components/holder';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function* yielding(element: ReactNode): AsyncGenerator<ReactNode> {
  await wait(10);
  yield element;
}

// props で渡すだけの要素を、Flight が要素とも配列とも素の object とも別に
// 書く入れ物に入れる。部品は描く途中で読む。RSC プラグインは client 参照を、
// それを読む server のチャンクごとに 1 つのチャンクに束ねるので、静的に
// import すると 6 つが同じ JS と CSS になり、どの入れ物の分が抜けても
// ほかの分の link で埋まる
export default async function Contained() {
  const [
    { InMap },
    { InSet },
    { InPromise },
    { InIterator },
    { InAsyncIterable },
    { InStream },
  ] = await Promise.all([
    import('../../components/in-map'),
    import('../../components/in-set'),
    import('../../components/in-promise'),
    import('../../components/in-iterator'),
    import('../../components/in-async-iterable'),
    import('../../components/in-stream'),
  ]);
  return (
    <>
      <title>contained</title>
      <Holder later={new Map([['map', <InMap key="map" />]])} />
      <Holder later={new Set([<InSet key="set" />])} />
      <Holder later={Promise.resolve(<InPromise />)} />
      <Holder later={[<InIterator key="iterator" />].values()} />
      <Holder later={yielding(<InAsyncIterable key="async-iterable" />)} />
      <Holder
        later={
          new ReadableStream<ReactNode>({
            start: (controller) => {
              controller.enqueue(<InStream key="stream" />);
              controller.close();
            },
          })
        }
      />
    </>
  );
}
