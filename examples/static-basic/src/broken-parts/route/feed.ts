export function GET(): Response {
  return new Response('feed');
}

export function POST(): Response {
  return new Response(null, { status: 201 });
}
