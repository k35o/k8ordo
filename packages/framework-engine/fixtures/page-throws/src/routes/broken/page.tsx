// 評価で投げるページ。読み込みに要る設定が無いページにあたる
const { settings } = globalThis as { settings?: { title: string } };
if (settings === undefined) throw new Error('the settings are missing');
const { title } = settings;

export default function BrokenPage() {
  return <h1>{title}</h1>;
}
