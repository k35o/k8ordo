import { JsonRenderDemo } from './json-render/demo';
import { OpenUiDemo } from './openui/demo';

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
      <h1 className="text-2xl font-bold">k8ordo UI × Generative UI アダプタ</h1>

      <Section
        title="json-render"
        description="JSON spec を <Renderer> に渡して描画。3番目は href 付きなので renderItem 経由で <a> になります。"
      >
        <JsonRenderDemo />
      </Section>

      <Section
        title="OpenUI"
        description="OpenUI Lang(DSL) 文字列を <Renderer> に渡して描画。同じ Button / Stack アダプタで、href は同様に <a> になります。"
      >
        <OpenUiDemo />
      </Section>
    </div>
  );
}

export default App;
