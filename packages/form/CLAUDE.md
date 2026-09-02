# Agent guide — packages/form

`@k8ordo/form` — one zod schema drives the HTML constraint attributes, the
messages, and the server-side validation. The shared discipline (React 19 / RSC
assumed, Baseline newly available only, no polyfills) and how a new package
joins are in the repository root's [`CLAUDE.md`](../../CLAUDE.md).

User-facing documentation is in [`docs/GUIDE.md`](docs/GUIDE.md), shipped inside
the npm package.

## Commands

```bash
pnpm test          # derive + parse tests (no browser)
pnpm build         # vp pack
pnpm typecheck
pnpm check         # check:write to auto-fix
```

## The one invariant

**Values live in the DOM. React state holds only what the DOM cannot express.**

Today that is exactly four things: which message to show for a field the
browser has judged invalid, which server errors are still current (the
`edited` set), the identity of each repeated row, and one dirty flag. Anything
that would mirror a field's value into React state breaks the package — it is
the mistake Conform spent a major version undoing.

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
  use-form.ts         useForm(): the client hook
  index.ts            client entry
  server.ts           server entry
```

## Where zod's public API runs out

`toJSONSchema` gives the constraints but not the messages, and object-level
checks (`refine`) vanish from its output without a trace.

- **Messages** are recovered by running the field schema against a probe value
  chosen to fail one specific check, then taking the issue message. The probe
  is what the parse would hand the schema for an empty control: `''` for text,
  `false` for a checkbox. Public API, and it guarantees the client shows the
  text zod itself would produce.
- **The internal surface** is `_zod.def`, read in four places: `checks` (the
  object-level count, and the source RegExp behind a JSON `pattern` string —
  the JSON loses the flags, and the flags decide whether the browser may see
  it), `innerType` (peeling `.optional()` / `.default()` wrappers so a wrapped
  object's subtree pairs with its JSON node), `element` (`zod/mini` arrays),
  and `entries`-shaped enum detection at the type level. Reporting what the
  client will not check is worth the coupling — Conform silently discards the
  same information. If zod moves any of it, the reports degrade; the
  attributes do not.
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
