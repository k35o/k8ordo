export const GET = ({
  params,
}: {
  params: { rest: readonly string[] };
}): Response => Response.json(params.rest);
