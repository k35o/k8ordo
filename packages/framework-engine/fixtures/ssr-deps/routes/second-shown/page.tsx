import SecondDefault from '../../components/second-default';

// /defaults が描く部品の片方を描く。ほかのページも読むので、その部品は
// もう片方とは別のチャンクに入る
export default function SecondShown() {
  return (
    <>
      <title>second shown</title>
      <SecondDefault />
    </>
  );
}
