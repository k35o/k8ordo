import { ClientA } from '../../components/client-a';

import styles from '../../components/server-a.module.css';

export default function PageA() {
  return (
    <>
      <title>page a</title>
      <h1 className={styles.mark}>body a</h1>
      <ClientA />
    </>
  );
}
