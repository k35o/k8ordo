# @k8ordo/ui × A2UI, json-render, OpenUI, the AI SDK, and MCP Apps

This example belongs to `@k8ordo/ui` and keeps the **glue** between its catalog and the formats an application connects it to. `@k8ordo/ui` describes its components for a model (`@k8ordo/ui/catalog`) and draws them (`@k8ordo/ui/catalog/render`), and depends on no format; the glue for [A2UI 1.0](https://a2ui.org), [json-render](https://json-render.dev), [OpenUI](https://www.openui.com), the [AI SDK](https://ai-sdk.dev), and [MCP Apps](https://github.com/modelcontextprotocol/ext-apps) lives here, under test, for an application to copy and own. Vite is just the host.

## Overview

This example showcases:

- k8ordo UI setup in a Vite project (Vite+ / `vp` toolchain)
- **A2UI glue** (`src/a2ui/`): the A2UI 1.0 catalog document, built from `@k8ordo/ui/catalog` with zod's JSON Schema, the React catalog for `@a2ui/react`'s `MessageProcessor`, and a screen as the input of a tool (`screen.ts`), which the chat and the MCP server share; scripted messages rendered with a field bound to the data model
- **json-render glue** (`src/json-render/`): the catalog, the registry, and `validateGeneratedSpec`, built by mapping over `@k8ordo/ui/catalog`; a typed `UISpec` rendered with `<JsonRenderUI />`
- **OpenUI glue** (`src/openui/`): the library and the React-free `prompt()`, built the same way; an OpenUI-Lang DSL string rendered with `library` + `Renderer`
- **AI SDK glue** (`src/ai-sdk/map-parts.ts`): `mapMessageParts`, which maps `useChat` messages onto the chat components — tool approval, attachments, sources, and copy / regenerate / feedback — driven by a scripted transport, so no server or API key is needed
- **MCP Apps glue**, both sides of it: an MCP server (`src/mcp/`) whose `show_ui` tool takes a screen written as A2UI components and gives it an App (`src/mcp-app/`) that draws it with `@k8ordo/ui`, built into one HTML file; and a chat (`src/mcp-chat/`) that draws the App of a tool part with the AI SDK's `MCPAppRenderer`, in a sandbox page served from another origin (`public/mcp-app-sandbox.html`). The same server runs over stdio for Claude Desktop — see [Trying the MCP App in Claude Desktop](#trying-the-mcp-app-in-claude-desktop)
- **Playground** (`src/playground/`), the 生成 UI tab of the page this example serves: ask Claude (`claude-opus-5-5`) for a screen in any of the three formats and watch it render as it streams, next to whether it keeps to the catalog, the state its fields write to, and the conversation. Press what it drew, and the action goes back to Claude with the state of every field; its answer is laid over the same screen — see [Trying it with a real model](#trying-it-with-a-real-model)
- **Chat** (`src/ui-chat/`), the チャット tab of the page: ask Claude for a screen, and it calls `show_ui` with A2UI components; the chat draws it in the page as the tool input streams in. What you press becomes your next message, shown as the event's `userMessage` and read by Claude as the action and the screen's state, and Claude answers on the same screen with `update_ui` — see [Chat](#chat-srcui-chat)
- **MCP Apps chat** (`src/mcp-chat/`), the MCP Apps tab of the page: ask Claude for a screen, and it calls `show_ui`; the App draws in the chat, follows the page's light or dark, and opens fullscreen. What you press goes back to Claude as your next message, and what you type reaches its context before you send anything
- Tailwind CSS 4 integration and TypeScript

The scripted demos of each piece of glue are test fixtures: the tests mount them, and the page does not. No piece of glue names a component. A component added to `@k8ordo/ui`'s catalog reaches every format here with no change to this directory.

## Getting Started

### Prerequisites

- Node.js >=26.13.1
- pnpm 12.x (`pnpm@12.4.0`)

### Installation & Setup

From the root of the k8ordo UI monorepo:

```bash
# Install dependencies
pnpm install

# Build the library first (the example resolves @k8ordo/ui from its dist/)
pnpm --filter @k8ordo/ui build

# Navigate to this example
cd examples/ui-integrations

# Start development server (Vite+ / vp)
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Trying it with a real model

The playground calls Claude through `/api/generate`, an endpoint only the dev server has (`vite.config.ts`). It reads the key the way the Anthropic SDK does: `ANTHROPIC_API_KEY`, or a profile from `ant auth login`. With fnox:

```bash
fnox exec -P anthropic -- pnpm dev
```

The endpoint refuses requests from another origin, since it spends the key. The tests run without a key: they stand in for the endpoint with fixed answers.

The チャット tab works the same way through `/api/ui-chat`, and the MCP Apps tab through `/api/chat`: each answers an AI SDK chat with Claude (`@ai-sdk/anthropic`, reading `ANTHROPIC_API_KEY`). `/api/chat` hands Claude the tools of the MCP server at `/mcp` on the same dev server. The dev server also rebuilds the App whenever its source changes, and serves the sandbox page on a second port, since MCP Apps requires the sandbox to be on another origin than the host.

### Trying the MCP App in Claude Desktop

Claude Desktop starts a local MCP server over stdio. Build `@k8ordo/ui` and the App first:

```bash
pnpm --filter @k8ordo/ui build
pnpm --filter example-ui-integrations build:mcp-app
```

Then add the server to `claude_desktop_config.json` (Settings → Developer → Edit Config) and restart Claude Desktop. Node runs `src/mcp/stdio.ts` as it is, so give the absolute path of a Node that strips types (this repository uses 26):

```json
{
  "mcpServers": {
    "k8ordo-ui": {
      "command": "/absolute/path/to/node",
      "args": [
        "/absolute/path/to/k8ordo/examples/ui-integrations/src/mcp/stdio.ts"
      ]
    }
  }
}
```

Ask Claude for a form, and it draws one with `@k8ordo/ui` in the conversation, in Claude Desktop's light or dark.

## Project Structure

```
examples/ui-integrations/
├── src/
│   ├── app.tsx                    # The page: the playground, the chat, and the MCP Apps chat, in three tabs
│   ├── read-json.ts               # Reads a JSON request body on the dev server
│   ├── catalog-props.ts           # Glue: what a format resolved, parsed into the props a renderer takes, or drawn as nothing
│   ├── prompt-language.test.ts    # The prompts the glue builds are English and say how a field binds
│   ├── a2ui/
│   │   ├── catalog.ts             # Glue: the A2UI catalog document (server-safe)
│   │   ├── catalog.test.ts        # The document holds every component and loads as an A2UI Catalog
│   │   ├── prompt.ts              # Glue: the system prompt for A2UI messages (server-safe)
│   │   ├── screen.ts              # Glue: a screen as a tool's input, its A2UI messages, and its checks (server-safe)
│   │   ├── screen.test.ts         # What the checks report, on a new screen and on a change to one
│   │   ├── renderer.tsx           # Glue: the React catalog, <A2uiSurfaces />, and <A2uiSurfaceOf /> ('use client')
│   │   ├── demo.tsx               # Scripted messages, a field bound to the data model
│   │   ├── demo.test.ts           # The messages pass validation; an unbound field does not
│   │   ├── demo.browser.test.tsx  # The surface renders and writes input back to the data model
│   │   └── renderer.browser.test.tsx  # A bound press reaches the action handler; an unbound Card is no button
│   ├── playground/
│   │   ├── server.ts              # /api/generate: streams Claude's answer as NDJSON (dev server only)
│   │   ├── request.ts             # Checks a request before the key is used
│   │   ├── stream.ts              # Reads the NDJSON in the browser
│   │   ├── playground.tsx         # The form, the conversation, and an action sent back as the next turn
│   │   ├── results.tsx            # Each format: what it draws, its state, its check, and the actions it hears
│   │   ├── panes.tsx              # The drawing, the check, the state, and the conversation side by side
│   │   └── playground.browser.test.tsx  # Each format renders, reports its check (an element it drew nothing for included), and sends a press back for an answer laid over it
│   ├── ai-sdk/
│   │   ├── map-parts.ts           # Glue: UIMessage.parts → parts for the chat components
│   │   ├── map-parts.test.ts      # Every part kind maps, in order
│   │   ├── endpoint.ts            # Reads a chat request and answers it with Claude (dev server only)
│   │   ├── endpoint.test.ts       # Requests from another origin, and malformed ones, are refused
│   │   ├── demo.tsx               # useChat rendered with @k8ordo/ui/ai via mapMessageParts
│   │   ├── scripted-transport.ts  # A ChatTransport that streams fixed replies instead of a model
│   │   ├── demo.test.ts           # The SDK-assembled reply keeps its approval id
│   │   └── demo.browser.test.tsx  # Approve / deny, attach, regenerate, and feedback through the real useChat
│   ├── mcp/
│   │   ├── show-ui.ts             # Glue: the show_ui tool, a screen of src/a2ui/screen.ts on one surface
│   │   ├── server.ts              # Glue: the MCP server with show_ui and the App's ui:// resource
│   │   ├── http.ts                # /mcp: the server over Streamable HTTP (dev server only)
│   │   ├── stdio.ts               # The server over stdio, for Claude Desktop (run by Node as it is)
│   │   └── server.test.ts         # The tool points at the App; the App is one HTML file; a broken screen is an error
│   ├── mcp-app/
│   │   ├── main.tsx               # The App's entry (mcp-app.html, built into one file by vite.mcp-app.config.ts)
│   │   ├── tool-call.ts           # Holds the tool call the host hands the App
│   │   ├── view.tsx               # Draws the screen; sends presses and state to the host; theme and fullscreen
│   │   └── view.browser.test.tsx  # Against ext-apps' AppBridge: drawing, messages, model context, theme, fullscreen
│   ├── mcp-chat/
│   │   ├── server.ts              # /api/chat and /api/mcp-app/resource: Claude with the MCP server's tools (dev server only)
│   │   ├── request.ts             # Checks a request for a ui:// resource
│   │   ├── app-frame.tsx          # Glue: MCPAppRenderer in the chat, with size, fullscreen, and theme
│   │   ├── chat.tsx               # useChat, drawing the App of each tool part that has one
│   │   ├── request.test.ts        # Only ui:// resources, and only from the same origin
│   │   └── chat.browser.test.tsx  # A fake App in the real sandbox: its message and model context reach the next request
│   ├── ui-chat/
│   │   ├── server.ts              # /api/ui-chat: Claude with show_ui and update_ui (dev server only)
│   │   ├── tools.ts               # Glue: show_ui and update_ui, each call checked on top of the screens before it
│   │   ├── screens.ts             # Glue: the calls of a conversation, the data-action part, and the report the model reads
│   │   ├── board.ts               # Glue: the chat's screens as the surfaces of one MessageProcessor, as the calls stream in
│   │   ├── chat.tsx               # useChat, drawing each screen where its tool part is and sending presses back
│   │   ├── tools.test.ts          # Calls that pass, and the ones refused
│   │   ├── screens.test.ts        # Which calls count, and what the model reads of a press
│   │   └── chat.browser.test.tsx  # Streaming in, a press sent back with the state, an answer laid over the screen
│   ├── json-render/
│   │   ├── catalog.ts             # Glue: the json-render catalog, UISpec, validateGeneratedSpec (server-safe)
│   │   ├── catalog.test.ts        # What validateGeneratedSpec accepts and reports
│   │   ├── registry.tsx           # Glue: the registry, <JsonRenderProvider />, and <JsonRenderUI /> ('use client')
│   │   ├── registry.browser.test.tsx  # The spec's state starts the bound fields; toAssistant reaches the app, setState does not; a null href is no link
│   │   ├── demo.tsx               # Typed UISpec rendered with <JsonRenderUI />
│   │   ├── demo.test.ts           # The spec passes validateGeneratedSpec with no fixes
│   │   └── demo.browser.test.tsx  # The spec renders and keeps form state in a real browser
│   ├── openui/
│   │   ├── defs.ts                # Glue: builds the OpenUI library from the catalog
│   │   ├── library.tsx            # Glue: the library with renderers ('use client')
│   │   ├── prompt.ts              # Glue: the system prompt, without React
│   │   ├── library.test.ts        # Every container takes every container as a child
│   │   ├── library.browser.test.tsx  # A press reaches onAction with the form state; a label-less Card stays unpressable; a null prop is drawn as absent; an element whose props do not parse is drawn as nothing
│   │   ├── demo.tsx               # OpenUI-Lang DSL rendered with library + Renderer
│   │   ├── demo.test.ts           # The DSL parses and every statement reaches the tree
│   │   └── demo.browser.test.tsx  # The DSL renders and keeps form state in a real browser
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts              # Vite type declarations
├── index.html                     # HTML template
├── mcp-app.html                   # The App's HTML template
├── public/mcp-app-sandbox.html    # Glue: the sandbox page MCPAppRenderer loads, on another origin
├── vite.mcp-app.config.ts         # Builds the App into one HTML file (dist/mcp-app/)
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # TypeScript configuration for src/
└── vite.config.ts                 # Vite configuration (vite-plus), with the spec / render test projects
```

## What's Included

### The shape of the glue

Each piece of glue maps over `catalog` from `@k8ordo/ui/catalog` and does three
things: it registers every component with the format, by name, with its
`description` and `props`; it binds each field's `value.prop` to the format's
state (json-render's `$bindState`, OpenUI's form state by `name`), starting from
`value.initial(props)`, and each of a component's `events` to the format's own
action; and it draws every component through `renderers` from
`@k8ordo/ui/catalog/render`, handing it the bound events as `on`. A renderer
takes props that fit the schema and hold no `null`, so every glue passes what
the format resolved through `parseCatalogProps` (`src/catalog-props.ts`) first:
it drops every `null` key, nested ones included (OpenUI Lang writes an omitted
argument as `null`), and parses the rest with the entry's `props` schema,
leaving out a field's value bound to the format's state. The format's own
validation lets more through: JSON Schema carries none of zod's own checks, and
OpenUI does not check `pattern`. An element whose props do not parse is drawn
as nothing (`<Unparsed />`), and its issues reach an `UnparsedContext` if one
is provided, which the playground shows beside the format's own. Every format
draws inside the application's `ToastProvider` (`src/main.tsx`, and
`src/mcp-app/main.tsx` for the App), which the `Toast` component opens its
toast through; an application that copies the glue draws inside its own.

An event is `press` today (`Button`, `IconButton`, `Card`, `DropdownMenuItem`),
and each format writes it its own way:

- A2UI: a `press` property of type `Action`. An `event` reaches the
  `MessageProcessor`'s action handler with its `context` read from the data
  model.
- json-render: `on.press` on the element. The glue declares one action,
  `toAssistant`, which `<JsonRenderProvider onToAssistant>` receives;
  json-render's own actions (`setState`, …) change the state without it.
- OpenUI: a `press` action argument, after the children. `Renderer`'s
  `onAction` receives it with the form state. A component with a `label` and no
  action sends its label, as OpenUI's prompt tells the model; a `Card` with no
  action is not pressable.

### json-render (`src/json-render/`)

A hand-written UI tree is typed with `satisfies UISpec` (so a typo in a component
name or prop is a compile error) and rendered with the glue's pre-wired client
component:

```tsx
import type { UISpec } from './catalog';
import { JsonRenderUI } from './registry';

const spec = {/* ... */} satisfies UISpec;

export function JsonRenderDemo() {
  return <JsonRenderUI spec={spec} />;
}
```

The spec's `state` is where the bound fields start. To read the state beside
the drawing, as the playground does, put json-render's `Renderer` (with the
glue's `registry`) and a reader using `useStateStore` inside
`<JsonRenderProvider spec={spec}>`.

### OpenUI (`src/openui/`)

An OpenUI-Lang DSL string is rendered with the glue's `library`:

```tsx
import { Renderer } from '@openuidev/react-lang';

import { library } from './library';

export function OpenUiDemo() {
  return <Renderer library={library} response={openuiLangString} />;
}
```

### AI SDK (`src/ai-sdk/`)

`useChat` owns the conversation; `mapMessageParts` turns each `UIMessage` into
parts that map onto `Message`, `Reasoning`, `ToolInvocation`, `Attachment`,
and `Source`. The tool asks for approval, and the answer goes straight back to
the SDK:

```tsx
const chat = useChat({
  transport: scriptedTransport,
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});

<ToolInvocation
  approval={part.approval}
  name={part.name}
  onApprovalResponse={chat.addToolApprovalResponse}
  state={part.state}
/>;
```

Attachments come from `PromptInput` (`accept` turns them on) and go to
`sendMessage` as a `FileList`. `scriptedTransport` stands in for the model: it
streams the same UI message chunks a server would, so the demo runs without a
backend.

### Chat (`src/ui-chat/`)

The AI SDK's own way to generative UI is a tool whose part the chat draws.
On `/api/ui-chat`, Claude has two tools: `show_ui`, whose input is a screen
written as A2UI components (the same input as the MCP server's), and
`update_ui`, which changes a screen shown before in place. A screen's id is the
id of the `show_ui` call that showed it. The server checks each call against
the catalog on top of the screens the conversation built, and a call that
breaks it goes back to Claude as a tool error to fix.

The chat draws every screen as a surface of one A2UI `MessageProcessor`
(`board.ts`): a screen appears while its tool input streams in, one component
at a time; an `update_ui` call changes the surface it names; and a call the
server refused takes its screen away. `<A2uiSurfaceOf>` draws a surface where
its tool part is.

What the user presses goes back as their next message, as a data part:

```tsx
board.processor.model.onAction.subscribe((payload) => {
  void chat.sendMessage(
    { parts: [{ type: 'data-action', data: board.actionOf(payload) }] },
    { body: { modelContext: contextOf(board.dataModels()) } },
  );
});
```

The chat shows the event's `userMessage` as the user's message (the pressed
component's `label` when the model wrote none), and the server turns the part
into a report of the action and the screen's whole data model with
`convertToModelMessages`' `convertDataPart`. Every request carries what each
screen holds now as `modelContext`, so what the user typed without pressing
anything reaches Claude too. A press while a reply streams is not sent.

### MCP Apps (`src/mcp/`, `src/mcp-app/`, `src/mcp-chat/`)

An MCP server gives a tool an App by pointing its `_meta.ui.resourceUri` at a
`ui://` resource: one HTML file the host draws in a sandboxed iframe. Here the
tool is `show_ui`, whose input is a screen written as A2UI components and the
data model they start from, and the App draws it with the A2UI glue, so the
model writes MCP App screens with the same catalog as everywhere else. The
server checks a call against the catalog and answers a broken screen with an
error that says what to fix. The App:

- turns a press into a `ui/message`: the action and the whole data model, as
  the user's next message;
- puts the data model in the model's context (`ui/update-model-context`) each
  time it changes;
- adds the `dark` class to its own `<html>` when the host's theme is dark,
  and keeps `@k8ordo/ui`'s look otherwise;
- offers fullscreen when the host has it.

Each call of `show_ui` is a screen of its own. Unlike the playground and the
chat, an answer is not laid over the screen before it: MCP Apps gives the model
no way to reach an App it has already shown.

The chat side is the AI SDK's: `/api/chat` connects to the MCP server with
`createMCPClient` (passing `mcpAppClientCapabilities`), gives the model the
tools `splitMCPAppTools` leaves visible to it, and the tool part carries the
App in `toolMetadata.app`. `mapMessageParts` keeps the part, and
`<McpAppFrame>` hands it to `MCPAppRenderer` with the page's theme, the
height the App asks for, and fullscreen. `MCPAppRenderer` loads a sandbox page
in an iframe and sends it the App's HTML; that page is yours to serve, on
another origin than the host. `public/mcp-app-sandbox.html` puts the HTML in an
inner iframe without `allow-same-origin`, applies the resource's CSP (or the
MCP Apps default when it declares none), and relays the messages both ways.

### Dependencies

- `@k8ordo/ui` (workspace)
- `@a2ui/react`, `@a2ui/web_core` (A2UI glue)
- `@anthropic-ai/sdk` (the playground's endpoint, dev only)
- `@json-render/core`, `@json-render/react` (json-render glue)
- `@openuidev/react-lang`, `@openuidev/lang-core` (OpenUI glue)
- `ai`, `@ai-sdk/react` (AI SDK glue)
- `@modelcontextprotocol/ext-apps`, `@modelcontextprotocol/client`, `@modelcontextprotocol/core` (the App), `@modelcontextprotocol/server`, `@modelcontextprotocol/node` (the MCP server), `@ai-sdk/mcp` (the chat's MCP client), `@ai-sdk/anthropic` (the chats' endpoints, dev only), `vite-plugin-singlefile` (the App's build)
- `zod` (the catalog's schemas)
- `tailwindcss`, `@tailwindcss/vite` (Tailwind CSS 4)

## Available Scripts

- `pnpm dev` - Start the development server (`vp dev`)
- `pnpm build` - Build for production (`vp build`), then the App
- `pnpm build:mcp-app` - Build the MCP App into one HTML file (`dist/mcp-app/mcp-app.html`)
- `pnpm test` - Run the tests (`vp test`): the `spec` project checks the glue, the demo spec and DSL, and the scripted replies against the AI SDK, and the `render` project mounts the demos, the playground, and the chats in headless Chromium, Firefox, and WebKit
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run Oxlint/Oxfmt linting/formatting checks (`vp check`)
- `pnpm check:write` - Run `vp check --fix` to auto-fix issues

## Key Configuration

### Vite Configuration

The project uses the Vite+ (`vite-plus`) toolchain and `@vitejs/plugin-react`.

### Tailwind CSS

Tailwind CSS 4 is configured via the `@tailwindcss/vite` plugin.
`src/styles.css` imports Tailwind, then k8ordo UI's bridge
(`@k8ordo/ui/tailwind.css`), which maps the design tokens onto Tailwind's
theme so they stay usable in this app's own markup. The bridge does not import
Tailwind itself: `@k8ordo/ui` does not depend on `tailwindcss`, the app does.
`src/tailwind.test.ts` compiles that entry with Tailwind and checks that the
utilities read the tokens. (Projects without
Tailwind import the prebuilt `@k8ordo/ui/styles.css` instead — see
`examples/ui-css-modules`.)

### TypeScript

Full TypeScript support with strict configuration for type safety.

## Related Documentation

- [k8ordo UI Main Documentation](../../packages/ui/README.md)
- [Generative UI](../../packages/ui/README.md#generative-ui)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

This example is part of the k8ordo UI monorepo. See the [main README](../../README.md) for more information about the project.
