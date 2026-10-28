import { Holder } from '../../components/holder';
import { LateElement } from '../../components/late-element';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// 描かない props の Promise は、HTML の描画を待たせない。ペイロードを読み切る
// 前に描けば、これが名指す参照は HTML の描画が終わったあとで届く
export default function PromisedNotFound() {
  return (
    <>
      <title>promised</title>
      <Holder
        later={wait(1000).then(() => (
          <LateElement />
        ))}
      />
    </>
  );
}
