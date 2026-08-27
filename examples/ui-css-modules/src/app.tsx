import { Badge, Button, Card, Heading, Switch } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './app.module.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <header className={styles.header}>
          <Heading level="h1">k8ordo UI × CSS Modules</Heading>
          <Switch
            label="ダークモード"
            onChange={(checked) => {
              document.documentElement.classList.toggle('dark', checked);
            }}
          />
        </header>

        <p className={styles.lead}>
          この example の依存に Tailwind CSS は存在しません。ビルド済みの
          <code className={styles.token}>@k8ordo/ui/styles.css</code>
          を1回読み込むだけで、コンポーネントはそのまま動きます。
        </p>

        <Card variant="outline">
          <div className={styles.cardBody}>
            <Heading level="h2">コンポーネントはそのまま使える</Heading>
            <p className={styles.note}>
              Button も Switch
              もライブラリに同梱されたクラスだけで描画されます。
              ダークモードの切り替えも{' '}
              <code className={styles.token}>.dark</code>
              クラスの付け外しだけです。
            </p>
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  setCount((prev) => prev + 1);
                }}
              >
                カウントアップ
              </Button>
              <Badge
                label={`${count} 回`}
                tone={count === 0 ? 'neutral' : 'info'}
              />
            </div>
          </div>
        </Card>

        <Card variant="outline">
          <div className={styles.cardBody}>
            <Heading level="h2">自分の UI は CSS Modules で書く</Heading>
            <p className={styles.note}>
              このページのレイアウトと文字色はすべて app.module.css
              にあります。デザイントークンはただの CSS
              カスタムプロパティとして配布されるので、
              <code className={styles.token}>var(--fg-mute)</code>
              のように参照でき、ダークモードにも自動で追従します。
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
