---
name: ui-design
description: |
  Building front-end UI with the @k8ordo/ui design system.
  Minimal design built on soft spacing and quiet refinement.

  Use when:
  - Writing React components or pages with @k8ordo/ui
  - Implementing UI for k8o's web sites
  - A minimal, internally consistent interface is called for

  Characteristics: teal/cyan palette (OKLCH), restrained animation, generous
  spacing, soft radii, tuned for Japanese typography
---

# @k8ordo/ui Design Skill

The design itself lives in the `docs/` the library ships on npm — that is the
single source of truth. This skill only bridges to it; it holds no guidance of
its own.

## Steps

1. **Read first**: `packages/ui/docs/GUIDE.md`
   (outside this repository: `node_modules/@k8ordo/ui/docs/GUIDE.md`)
2. From the "Detailed reference" list at the end of GUIDE.md, follow **only what
   the task actually needs**. Token values, component props, hooks, and
   generative UI all live there.
3. When unsure, check the work against GUIDE.md's "Anti-patterns: avoiding AI
   slop".

## What this skill adds

- **Look for an existing component first**: before hand-rolling a `div`, search
  the catalog in `references/components.md`. Never conclude a component is
  missing without reading that list.
- **Never write raw values**: colors, spacing, radii, and font weights all go
  through semantic tokens. Non-token values such as `bg-teal-500` or
  `font-semibold` are out.
- **Verify in Storybook**: real behavior is at
  <https://main--687a213c85e2e4589d8db1bb.chromatic.com> (its MCP endpoint is
  the same URL plus `/mcp`). Do not write props from memory.
