export default function PathPage({
  params,
}: {
  params: { path: readonly string[] };
}) {
  return <h1>{params.path.join('/')}</h1>;
}
