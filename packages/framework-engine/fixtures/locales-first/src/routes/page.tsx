import { ClientPart } from '../components/client-part';
import { sawAtLoad } from '../evaluations';

sawAtLoad('page');

export default function HomePage() {
  return <ClientPart />;
}
