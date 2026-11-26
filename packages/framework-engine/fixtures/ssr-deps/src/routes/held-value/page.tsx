import { HeldValue } from '../../components/held-value';
import { Holder } from '../../components/holder';

// 要素ではなく、client コンポーネントそのものを値として渡す
export default function HeldValuePage() {
  return (
    <>
      <title>held value</title>
      <Holder later={HeldValue} />
    </>
  );
}
