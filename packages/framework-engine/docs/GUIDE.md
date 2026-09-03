# @k8ordo/framework-engine

**Do not install this package.** An application installs `@k8ordo/static` or
`@k8ordo/server`; this is the machinery both of them are built on, published
only so that they can resolve it.

What it holds is everything the two modes share, which is nearly everything:

- **The `routes/` grammar.** A directory tree is the application's pathname
  space, parsed and checked as a pure function of the file list.
- **The generator.** The route table (`.k8ordo/routes.gen.ts`) and the type
  wiring for `@k8ordo/router` and `@k8ordo/state` (`.k8ordo/register.d.ts`)
  are written rather than hand-maintained.
- **The RSC pipeline**, and the configuration it needs to be correct — the
  client dependencies the optimizer cannot discover on its own, and a single
  React across every environment.
- **The execution boundary**, enforced on what reaches the client bundle.
- **The request handler.** One function turns a request into a page. The
  difference between the two modes is when it is called: once per route at
  build time, or once per request.

The grammar and the generator are documented where an application meets them,
in [`@k8ordo/static`](https://ordo.k8o.me/static/docs/GUIDE.md) and
[`@k8ordo/server`](https://ordo.k8o.me/server/docs/GUIDE.md).
