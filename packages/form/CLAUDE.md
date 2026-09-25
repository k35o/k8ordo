# Agent guide — packages/form

`@k8ordo/form` — one zod schema drives the HTML constraint attributes, the
messages, and the server-side validation. The shared discipline (React 19 / RSC
assumed, Baseline newly available only, no polyfills) and how a new package
joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped inside
the npm package.

## Commands

```bash
pnpm test          # unit tests (derive, parse, rules, walk, paths, zod/mini) and useForm in Chromium, Firefox and WebKit (Playwright)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The one invariant

**Values live in the DOM. React state holds only what the DOM cannot express.**

Today that is exactly five things: which message to show for a field the
browser has judged invalid, which server errors are still current (the
`edited` set), the identity of each repeated row, one dirty flag read back
from the DOM, and the row counts the server state rendered with (adding or
removing a row is measured against them). Anything that would mirror a
field's value into React state breaks the package.

This is also the test for a new feature. `isDirty` is fine because
`el.value !== el.defaultValue` reads the DOM and yields one boolean. Input
masking is fine because it rewrites `el.value` in place. A `watch()` that
re-renders on every keystroke is not.

## Layout

```
src/
  derive/
    attributes.ts     JSON Schema leaf → input attributes, + what was dropped
    messages.ts       probe the schema to get zod's own wording per flag
    form-fields.ts    formFields(): the server-side entry
  parse/
    parse-form.ts     FormData → structure → safeParse → typed errors
    paths.ts          `items[1].name` ↔ nested value / zod issue path
  rules/
    rules.ts          sameAs / minChecked / requiredWhen and the one evaluator
    define-form.ts    defineForm(): a schema plus rules typed against its paths
  schema/
    walk.ts           pair the zod tree with its JSON Schema (derive and parse)
    object-schema.ts  the object type zod and zod/mini share
  use-form.ts         useForm(): the client hook
  async-check.ts      useAsyncCheck(): a per-field check the server answers
  hidden-value.tsx    HiddenValue: a value from a component with no input
  paths.ts            FieldPathsOf / ArrayPathsOf: paths from the schema type
  types.ts            the serializable shapes that cross to the client
  index.ts            client entry
  server.ts           server entry
```

## Where zod's public API runs out

`toJSONSchema` gives the constraints but not the messages, and object-level
checks (`refine`) vanish from its output without a trace.

- **Messages** are recovered by running the field schema against a probe value
  chosen to fail one specific check, then taking the issue message. The probe
  is what the parse would hand the schema for an empty control: `''` for text,
  `false` for a checkbox, `undefined` for a number, a file, or a choice. Public
  API, and it guarantees the client shows the text zod itself would produce.
- **The internal surface** is `_zod.def`, read in six places: `checks` (the
  object-level count), `format` / `pattern` on the leaf and on each of its
  checks (which format picks the control once a stacked check has overwritten
  or erased the JSON `format`, which regex is the format's own, and the flags
  the JSON `pattern` string has lost), `innerType` (peeling `.optional()` /
  `.default()` wrappers so a wrapped leaf or object pairs with its JSON node),
  `element` (`zod/mini` arrays), `type` (a bigint, which JSON Schema cannot
  represent, submits a blank the way a number does), and `entries`-shaped enum
  detection at the type level. Reporting what the client will not check is
  worth the coupling. If zod moves them, the failures differ: without `checks`
  the object-level report goes quiet; without `format` / `pattern` the control
  falls back to whatever `format` the JSON kept (`z.iso.time()` and a local
  `z.iso.datetime()` to `type="text"`) and a flagged regex reaches `pattern`
  as if it had no flags; without `innerType` or `element` the walk throws on a
  wrapped object or array, or on any `zod/mini` array; without `type` a blank
  bigint reads as 0n again.
- **A pairing the walk cannot make is a throw, not a skip.** A JSON node with
  no matching zod node (records, tuples, nullable objects, nested repeats,
  dotted keys) would parse to silently discarded input, which is the one
  failure mode this package exists to rule out.

## Conventions

- `type`, not `interface`; no `@ts-ignore`; no skipped tests.
- Comments explain why the straightforward version was not used — not what the
  code does.
- Tests state a guarantee in their name ("marks a field required only when the
  schema rejects an empty string"), not the function they call.
- Anything shipped in `docs/` is English; comments and commits are Japanese.
