// 描く途中で読む。読んだ先が client コンポーネントを描く
export default async function Lazy() {
  const { LazyDemo } = await import('../../components/lazy-demo');
  return (
    <>
      <title>lazy</title>
      <LazyDemo />
    </>
  );
}
