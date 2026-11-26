import { Code, Heading } from '@k8ordo/ui';

import { Playground } from './playground/playground';

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <Heading level="h1">生成 UI の試し打ち</Heading>
        <p className="text-fg-mute">
          Claude に頼むと、選んだ形式で @k8ordo/ui
          の部品だけを使った画面を書きます。書かれた分から描き、その横に、入力欄を触ったときに値が入る先と、部品の書き方がカタログに合っているかを並べます。
        </p>
        <p className="text-fg-mute text-sm">
          本物の Claude を呼ぶので、
          <Code>fnox exec -P anthropic -- pnpm dev</Code>
          で起動したときだけ動きます。
        </p>
      </header>
      <Playground />
    </main>
  );
}

export default App;
