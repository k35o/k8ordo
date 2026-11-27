export default function EntryPage({
  params,
}: {
  readonly params: { readonly year: number; readonly slug: string };
}) {
  return (
    <p>
      {params.slug} in {params.year}
    </p>
  );
}
