import { HeldElement } from '../../components/held-element';

// /held が props で渡すだけの要素を描く。ほかのページも読むので、その部品は
// Holder とは別のチャンクに入る
export default function HeldShown() {
  return (
    <>
      <title>held shown</title>
      <HeldElement />
    </>
  );
}
