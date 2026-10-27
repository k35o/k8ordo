import { HeldElement } from '../../components/held-element';
import { Holder } from '../../components/holder';

export default function Held() {
  return (
    <>
      <title>held</title>
      <Holder later={<HeldElement />} />
    </>
  );
}
