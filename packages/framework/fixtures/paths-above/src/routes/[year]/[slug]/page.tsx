// year を読み替えて slug を要るのは、ページのスキーマが隣の paths.ts の受け取る
// year に関わらないことを確かめるため
export const paramsSchema = {
  '~standard': {
    version: 1,
    vendor: 'fixture',
    validate: (value: unknown) => {
      const { year, slug } = value as {
        readonly year: number;
        readonly slug?: string;
      };
      return slug === undefined
        ? { issues: [{ message: 'no slug' }] }
        : { value: { slug, year: `the year ${String(year)}` } };
    },
  },
} as const;

export default function EntryPage({
  params,
}: {
  readonly params: { readonly year: string; readonly slug: string };
}) {
  return (
    <p>
      {params.slug} in {params.year}
    </p>
  );
}
