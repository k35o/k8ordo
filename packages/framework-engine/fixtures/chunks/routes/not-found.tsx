import { ClientN } from '../components/client-n';

import styles from '../components/server-n.module.css';

export default function NotFound() {
  return (
    <>
      <title>page n</title>
      <h1 className={styles.mark}>body n</h1>
      <ClientN />
    </>
  );
}
