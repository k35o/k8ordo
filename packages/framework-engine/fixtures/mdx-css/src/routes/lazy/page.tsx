// 記事を slug ごとに遅れて読むサイトの形
const articles = import.meta.glob<{ default: () => React.ReactNode }>(
  '../../content/aside.mdx',
);

export default async function LazyPage() {
  const load = articles['../../content/aside.mdx'];
  if (load === undefined) throw new Error('aside.mdx is not in the glob');
  const { default: Aside } = await load();
  return <Aside />;
}
