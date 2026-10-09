// 殻の not-found には使われない。id に !fallback を受け取ってしまうため
export default function PostNotFound({
  params,
}: {
  params: Readonly<Record<string, string>>;
}) {
  return <h1>no post {params['id']}</h1>;
}
