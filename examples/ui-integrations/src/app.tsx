import { Code, Heading, Spinner, Tabs } from '@k8ordo/ui';
import { Suspense } from 'react';

import { McpChat } from './mcp-chat/chat';
import { Playground } from './playground/playground';

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <Heading level="h1">生成 UI の試し打ち</Heading>
        <p className="text-fg-mute">
          Claude に頼むと、@k8ordo/ui の部品だけを使った画面を書きます。「生成
          UI」では、選んだ形式で書かれた分から描き、その横に、入力欄を触ったときに値が入る先と、部品の書き方がカタログに合っているかを並べます。「MCP
          Apps」では、Claude が MCP のツールで画面を出し、チャットの中に MCP App
          として描きます。
        </p>
        <p className="text-fg-mute text-sm">
          本物の Claude を呼ぶので、
          <Code>fnox exec -P anthropic -- pnpm dev</Code>
          で起動したときだけ動きます。
        </p>
      </header>
      <Tabs.Root
        defaultSelectedId="generative"
        ids={['generative', 'mcp-apps']}
      >
        <Tabs.List label="試すもの">
          <Tabs.Tab id="generative">生成 UI</Tabs.Tab>
          <Tabs.Tab id="mcp-apps">MCP Apps</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="generative">
          <Playground />
        </Tabs.Panel>
        <Tabs.Panel id="mcp-apps">
          <div className="flex flex-col gap-6">
            <p className="text-fg-mute max-w-2xl">
              チャットで頼むと、Claude が <Code>show_ui</Code>{' '}
              ツールを呼び、A2UI で書いた画面を、ツールの MCP App
              として描きます。画面のボタンを押すと、何をしたかと画面の状態が
              Claude に届きます。同じ MCP サーバーは Claude Desktop
              にもつなげます。
            </p>
            <Suspense fallback={<Spinner label="準備しています" />}>
              <McpChat />
            </Suspense>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </main>
  );
}

export default App;
