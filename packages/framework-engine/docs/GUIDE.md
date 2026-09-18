# @k8ordo/framework-engine

**Private.** This package is never published: an application installs
`@k8ordo/static` or `@k8ordo/server`, and each of those bundles this engine
into itself at pack time. What is here is everything the two modes share,
which is nearly everything:

- **The `routes/` grammar.** A directory tree is the application's pathname
  space, parsed and checked as a pure function of the file list.
- **The generator.** The route table (`.k8ordo/routes.gen.ts`) and the type
  wiring for `@k8ordo/router` and `@k8ordo/state` (`.k8ordo/register.gen.ts`)
  are written rather than hand-maintained.
- **The RSC pipeline**, and the configuration it needs to be correct — the
  client dependencies the optimizer cannot discover on its own, and a single
  React across every environment.
- **The execution boundary**, enforced on what reaches the client bundle.
- **The request handler.** One function turns a request into a page, compiled
  for each mode. The difference between the two modes is chiefly when it is
  called: for each route at build time — once for its HTML, once for its
  payload — or once per request.

The grammar and the generator are documented where an application meets them,
in [`@k8ordo/static`](../../static/docs/GUIDE.md) and
[`@k8ordo/server`](../../server/docs/GUIDE.md).
