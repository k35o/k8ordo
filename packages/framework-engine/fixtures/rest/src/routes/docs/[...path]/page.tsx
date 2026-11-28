// 配列を受け取る手書きの Standard Schema。private で始まるものを拒み、
// 残りは大文字にして渡す
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { path } = value as { path: readonly string[] };
      return path[0] === 'private'
        ? { issues: [{ message: 'not a public doc' }] }
        : { value: { path: path.map((segment) => segment.toUpperCase()) } };
    },
  },
} as const;

export default function DocPage({
  params,
}: {
  params: { path: readonly string[] };
}) {
  return <h1 data-path={params.path.join('|')}>doc</h1>;
}
