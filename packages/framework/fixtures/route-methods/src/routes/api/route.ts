// ファイルは GET 以外に答えられない。静的化はこれを名指しで断る
export function GET(): Response {
  return Response.json({ ok: true });
}

export function POST(): Response {
  return new Response(null, { status: 201 });
}
