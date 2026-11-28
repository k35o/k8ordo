export default function PathPage({
  params,
  pathname,
}: {
  params: { path: readonly string[] };
  pathname: string;
}) {
  return (
    <h1
      data-count={params.path.length}
      data-path={params.path.join('|')}
      data-pathname={pathname}
    >
      path
    </h1>
  );
}
