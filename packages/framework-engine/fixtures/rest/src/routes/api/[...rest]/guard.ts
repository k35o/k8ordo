export default function guard({
  params,
}: {
  params: { rest: readonly string[] };
}): Response | undefined {
  return params.rest[0] === 'secret'
    ? new Response(`no ${params.rest.join('|')}`, { status: 401 })
    : undefined;
}
