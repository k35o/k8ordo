// 数字だけを受け付ける
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { id } = value as { id: string };
      return /^\d+$/u.test(id)
        ? { value: { id } }
        : { issues: [{ message: 'not a number' }] };
    },
  },
} as const;

export default function PostPage({ params }: { params: { id: string } }) {
  return <p>page {params.id}</p>;
}
