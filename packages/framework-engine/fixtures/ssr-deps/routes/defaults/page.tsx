import FirstDefault from '../../components/first-default';
import SecondDefault from '../../components/second-default';

// どちらの export も default という名前で名指される
export default function Defaults() {
  return (
    <>
      <title>defaults</title>
      <FirstDefault />
      <SecondDefault />
    </>
  );
}
