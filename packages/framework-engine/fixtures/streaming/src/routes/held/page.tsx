import { Holder } from '../../components/holder';
import { wait } from '../../lib/wait';

async function Late() {
  await wait(1000);
  return <p>arrived in a prop</p>;
}

// データを待つ部品を、描かない props にだけ渡す
export default function HeldPage() {
  return <Holder later={<Late />} />;
}
