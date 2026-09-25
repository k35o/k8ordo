export default function guard(): Response {
  return new Response(null, { status: 401 });
}
