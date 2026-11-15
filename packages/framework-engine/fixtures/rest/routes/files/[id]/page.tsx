// 手書きの Standard Schema。数字だけの区間を受け、ほかは [...path] に回す
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { id } = value as { id: string };
      return /^\d+$/u.test(id)
        ? { value: { id: Number(id) } }
        : { issues: [{ message: 'not a number' }] };
    },
  },
} as const;

export default function FilePage({ params }: { params: { id: number } }) {
  return <h1 data-id={params.id}>one file</h1>;
}
