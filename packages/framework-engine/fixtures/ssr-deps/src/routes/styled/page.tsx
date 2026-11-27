import { Icon } from '../../components/icon';

import styles from '../../components/styled.module.css';

// Server Component の CSS と、client コンポーネントの CSS を両方読む
export default function Styled() {
  return (
    <>
      <title>styled</title>
      <p className={styles.mark}>MARK_STYLED</p>
      <Icon />
    </>
  );
}
