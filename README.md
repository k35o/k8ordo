# k8ordo UI

A modern, TypeScript-first React UI component library built with performance and developer experience in mind.

## Features

- **Modern Stack**: Built with React 19 and TypeScript 6+
- **Accessible**: WCAG compliant components with full keyboard navigation
- **Performant**: Optimized bundle size with tree-shakeable components
- **Developer Friendly**: Comprehensive TypeScript support and Storybook documentation
- **Customizable**: Semantic design tokens for easy theming — works from prebuilt CSS alone, with an optional Tailwind CSS 4 entry
- **Generative UI Ready**: Official [json-render](https://json-render.dev) and [OpenUI](https://www.openui.com) adapters let an LLM generate on-brand UIs from these components — `validateGeneratedSpec()` validates/repairs LLM output and `<JsonRenderUI spec={spec} />` renders it in one line. See [Generative UI integrations](packages/ui/README.md#generative-ui-integrations).

## Installation

```bash
npm install @k8ordo/ui
# or
pnpm add @k8ordo/ui
# or
yarn add @k8ordo/ui
```

## AI Agent Documentation

The design guide ships inside the published npm package, so an agent reads the
version you actually installed. Paste the snippet from
[AI Agent Documentation](packages/ui/README.md#ai-agent-documentation)
into your project's `CLAUDE.md` / `AGENTS.md` — that section also lists the
`llms.txt`, generated token spec, and Storybook MCP endpoints.

## Development

This is a monorepo managed with [Vite+](https://vite.plus) (`vp`) and pnpm.

### Prerequisites

- Node.js ≥24.13.0
- pnpm 11.15.1

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Run linting and formatting
pnpm check:write
```

### Project Structure

```
apps/
  docs/                  # Documentation site (Vite + @funstack/router)
packages/
  ui/                    # Main UI library package
examples/
  ui-integrations/       # Generative UI adapters example (Vite)
  ui-nextjs/             # Next.js example application
  ui-css-modules/        # Prebuilt-CSS example (no Tailwind)
```

### Available Scripts

- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm typecheck` - Type check all packages
- `pnpm check` - Run linting checks
- `pnpm check:write` - Run linting checks and auto-fix
- `pnpm change` - Write a release intent for the changed packages

### Visual Regression Testing

Per-story VRT runs on [storybook-addon-vrt](https://github.com/k35o/storybook-addon-vrt).

```bash
pnpm --filter @k8ordo/ui test:vrt          # capture story screenshots
pnpm --filter @k8ordo/ui exec svrt compare # compare against the baseline
pnpm --filter @k8ordo/ui exec svrt approve # accept changes as the new baseline
```

On CI, every pull request is compared against the latest baseline captured on
`main`, and a summary with a link to the visual report is posted as a PR
comment. Merging the pull request makes its screenshots the next baseline.

## Documentation

- [Official documentation site](https://ordo.k8o.me)
- [Storybook](https://main--687a213c85e2e4589d8db1bb.chromatic.com)
- [Component Documentation](packages/ui/README.md)
- [Generative UI integrations (json-render / OpenUI)](packages/ui/README.md#generative-ui-integrations)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for environment setup, development commands, the component/story workflow, visual regression testing, and the release process.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**k8o** ([GitHub](https://github.com/k35o))
