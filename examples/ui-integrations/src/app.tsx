import { A2uiDemo } from './a2ui/demo';
import { AiSdkChatDemo } from './ai-sdk/demo';
import { JsonRenderDemo } from './json-render/demo';
import { OpenUiDemo } from './openui/demo';
import { Playground } from './playground/playground';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-fg-mute text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}

function App() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">k8ordo UI × 生成 UI のつなぎ</h1>

      <Section
        title="試し打ち"
        description="Claude（claude-opus-5-5）に、選んだ形式で k8ordo の部品だけを使った画面を作らせます。fnox exec -P anthropic -- pnpm dev で起動したときだけ動きます。"
      >
        <Playground />
      </Section>

      <Section
        title="json-render"
        description="JSON spec を <JsonRenderUI> に渡して描画。ボタン行の3番目は href 付きなので renderItem 経由で <a> になります。"
      >
        <JsonRenderDemo />
      </Section>

      <Section
        title="OpenUI"
        description="OpenUI Lang(DSL) 文字列を <Renderer> に渡して描画。同じ Button / Stack アダプタで、href は同様に <a> になります。"
      >
        <OpenUiDemo />
      </Section>

      <Section
        title="A2UI 1.0"
        description="A2UI のメッセージ（createSurface、updateComponents、updateDataModel）を MessageProcessor に渡して描画。入力欄の値は @path でデータモデルに結んであり、下の行に書き込まれた値が出ます。"
      >
        <A2uiDemo />
      </Section>

      <Section
        title="AI SDK"
        description="useChat の UIMessage を mapMessageParts で部品に割り当てるチャット。ツールの許可・拒否、添付、出典、data パーツで届く生成 UI、コピー・再生成・フィードバックまで、台本どおりに返す transport で動かします。"
      >
        <AiSdkChatDemo />
      </Section>
    </div>
  );
}

export default App;
