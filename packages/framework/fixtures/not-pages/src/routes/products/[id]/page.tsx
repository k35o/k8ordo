import { notFound } from '@k8ordo/router';

// このパッケージは zod に依存しないので、Standard Schema を手で書く
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { id } = value as { readonly id: string };
      return /^\d+$/u.test(id)
        ? { value: { id: Number(id) } }
        : { issues: [{ message: `${id} is not a number` }] };
    },
  },
} as const;

const PRODUCTS = new Map([[1, 'first product']]);

export default function ProductPage({
  params,
}: {
  readonly params: { readonly id: number };
}) {
  const name = PRODUCTS.get(params.id);
  if (name === undefined) notFound();
  return <h1>{name}</h1>;
}
