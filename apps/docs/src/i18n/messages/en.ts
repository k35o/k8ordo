import type { MessageKey } from '../types';

export const en = {
  'nav.home': 'Home',
  'nav.getStarted': 'Get Started',
  'nav.components': 'Components',
  'nav.theming': 'Theming',
  'nav.i18n': 'i18n',
  'nav.hooks': 'Hooks',
  'nav.helpers': 'Helpers',
  'nav.generativeUi': 'Generative UI',
  'nav.aiChat': 'AI Chat',
  'home.description':
    'React libraries that use Baseline features without holding back',
  'home.exploreUi': 'Explore UI',
  'home.membersTitle': 'Packages',
  'home.memberUiDescription':
    'React components with semantic design tokens, i18n, and generative-UI adapters.',
  'home.memberFormDescription':
    'Derives HTML constraint attributes, messages, and server-side validation from one zod schema. The DOM holds the values, so it works without JavaScript.',
  'home.memberStateDescription':
    'Declares state by where it lives — URL, history entry, localStorage, memory — one zod schema each, riding the Navigation API.',
  'home.disciplineTitle': 'Shared commitments',
  'home.disciplinePlatform': 'Baseline only',
  'home.disciplinePlatformDescription':
    'A feature is fair game the moment it reaches Baseline newly available — shipped in all four core browsers — rather than 30 months later at widely available. With no polyfills and no fallbacks it runs only on current browsers — it did not drop the old ones, it never ran on them.',
  'home.disciplineReact': 'Always on the latest React',
  'home.disciplineReactDescription':
    'React 19 and Server Components are assumed, and each new idiom is adopted as it lands. No compatibility path is kept around, so there is only ever one way to write it.',
  'home.disciplineTypes': 'TypeScript safe',
  'home.disciplineTypesDescription':
    'Types are not there to check what you wrote after the fact — they are there to make the mistake unwritable. Docs and generated artifacts are derived from the types, so they cannot drift from the implementation.',
  'home.disciplineAgents': 'Readable by agents',
  'home.disciplineAgentsDescription':
    'Every package ships its own documentation inside its npm package, so an agent reads the exact version you installed — nothing to copy, nothing to re-sync, no version drift.',
  'ui.description':
    'A React component library for UI that is calm but never boring',
  'ui.getStarted': 'Get Started',
  'ui.viewComponents': 'Browse Components',
  'common.github': 'GitHub',
  'ui.featuresTitle': 'Features',
  'ui.featureReact': 'React 19',
  'ui.featureReactDescription':
    'Usable straight from Server Components — anything that does not need the client stays rendered on the server.',
  'ui.featureTokens': 'Design Tokens',
  'ui.featureTokensDescription':
    'One prebuilt CSS import and it just works — no Tailwind CSS setup required. Semantic tokens keep colors and spacing consistent, and light and dark modes switch seamlessly.',
  'ui.featureTypeScript': 'TypeScript',
  'ui.featureTypeScriptDescription':
    'The props reference is generated from the types, so the docs cannot drift from the implementation. Write a prop that does not exist and the editor tells you before you ever run it.',
  'ui.featureAgents': 'A surface for agents',
  'ui.featureAgentsDescription':
    'The design guide and reference ship inside the npm package, so an agent reads the exact version you installed from `node_modules/@k8ordo/ui/docs/`. Real props can also be queried through Storybook\u2019s MCP endpoint.',
  'ui.featureAccessible': 'Accessibility',
  'ui.featureAccessibleDescription':
    'Aiming for components that consider keyboard navigation and screen reader support based on WAI-ARIA patterns.',
  'ui.featureMinimal': 'Soft & Sharp Design',
  'ui.featureMinimalDescription':
    'Soft where you touch, sharp where you read. UI that speaks through whitespace and gentle forms.',
  'ui.featureVerticalWriting': 'Vertical Writing Support',
  'ui.featureVerticalWritingDescription':
    'Switch writing-mode with the `writing-v` utility and every component follows along on a vertical page. Preview the Japanese docs in vertical mode.',
  'common.language': 'Language',
  'footer.docs': 'Documentation',
  'footer.packages': 'Packages',
  'footer.resources': 'Resources',
  'form.description':
    'One zod schema produces the HTML constraint attributes, the messages, and the server-side validation. The DOM holds the values, so the form works with JavaScript disabled or not yet loaded.',
  'form.featuresTitle': 'Features',
  'form.featureSchema': 'One source: the schema',
  'form.featureSchemaDescription':
    'required, maxLength and type all come from the schema you wrote. No writing the same constraint twice, once in JSX and once on the server.',
  'form.featureNoJs': 'Works without JavaScript',
  'form.featureNoJsDescription':
    'A Server Action receives the submission. Errors come back per field and so do the values, so a retry never means typing it all again.',
  'form.featureDom': 'The DOM holds the values',
  'form.featureDomDescription':
    'Typing causes no re-render. Values never enter React state — it carries only what the DOM cannot express, like the messages on screen and the identity of each row.',
  'form.featureTypes': 'Paths are checked by the compiler',
  'form.featureTypesDescription':
    "A typo like `field('titel')` fails the build rather than the click. Nested paths and arrays are distinguished the same way.",
  'form.featureLoud': 'Never breaks in silence',
  'form.featureLoudDescription':
    'A field in the schema that never arrived is reported as a wiring mistake, not a validation failure. Checks that could not become attributes are listed too.',
  'form.featureSecrets': 'Secrets are never echoed',
  'form.featureSecretsDescription':
    'Values come back so a retry keeps the input, with password fields excluded automatically — the library generated the attributes, so it knows which ones they are.',
  'form.docsTitle': 'Documentation',
  'form.docsDescription':
    'The guide and reference ship inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/form/docs/`.',
  'state.description':
    'Declare state by where it lives. Four places — URL search params, the history entry, localStorage, memory — each typed by one zod schema, from which the server read, link building and the subscription are all derived.',
  'state.demoTitle': 'Running on this very page',
  'state.demoDescription':
    'The controls below rewrite the real URL: `definePageState` updates flow through this site’s router (@k8ordo/router, which intercepts the Navigation API). The theme toggle in the header stores through `defineLocalState` — its current value is the theme row.',
  'state.demoUrlEmpty': 'no query (all defaults)',
  'state.demoThemeSystem': 'following the system',
  'state.demoHint':
    'The page steppers push, so the browser back button rewinds them one by one. The tabs replace, refining the current entry. Copy the URL and the state travels with it. Hand-edit `?page=0` into the URL and the schema drops it to the default.',
  'state.featuresTitle': 'Features',
  'state.featurePlaces': 'Declared by where it lives',
  'state.featurePlacesDescription':
    'URL, history entry, localStorage, memory. Lifetime and sharing scope are decided by the place you declared, not by how the code happens to be written.',
  'state.featureSchema': 'One source: the schema',
  'state.featureSchemaDescription':
    'parseUrl, link building and the salvage of stale data all derive from the schema you wrote. A search form can share the very same schema with @k8ordo/form.',
  'state.featureNavigation': 'Rides the Navigation API',
  'state.featureNavigationDescription':
    'The URL and the hidden entry state are two faces of one history entry: updated atomically in a single navigate, restored together by the back button.',
  'state.featureKeys': 'Subscribe per key',
  'state.featureKeysDescription':
    'List the keys you read and updates to any other field never re-render you. The schema fixes the key set, so change detection is exact.',
  'state.featureCanonical': 'Invalid values never render',
  'state.featureCanonicalDescription':
    'update passes the schema on the spot, and a hand-edited URL param falls back to its own default, field by field. Defaults are omitted from the query, so the same state always makes the same URL.',
  'state.featureServer': 'The server can read it',
  'state.featureServerDescription':
    'URL state reads typed in an RSC via parseUrl. Links and GET forms work under any router, before JavaScript loads.',
  'state.docsTitle': 'Documentation',
  'state.docsDescription':
    'The guide and reference ship inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/state/docs/`.',
  'router.description':
    "The URL's pathname axis, owned. The route table is the application's pathname schema, and from it come the types, the matching, the links and the navigation. Search params and history-entry state belong to @k8ordo/state — the division is the URL's own \"?\".",
  'router.featuresTitle': 'Features',
  'router.featureTable': 'The table is the schema',
  'router.featureTableDescription':
    'Leaves, branches, `[param]`, wildcards and groups that structure without appearing in the URL, all in one table. Matching is in declaration order, first match wins — no specificity ranking to reason backwards from.',
  'router.featureTypes': 'Types come from the pattern',
  'router.featureTypesDescription':
    'Params are inferred from the pattern literal, and once `Register` is declared a pattern the table does not have fails to compile. No code generation.',
  'router.featureNavigation': 'finished means on screen',
  'router.featureNavigationDescription':
    'The intercept handler resolves after React commits the new tree. When only the search moved, the route tree is left alone and neither scroll nor focus is disturbed.',
  'router.featureNoLink': 'No Link component',
  'router.featureNoLinkDescription':
    'Under the Navigation API a plain `<a>` is already a client navigation. Wrapping it would add a second way to write the same thing; `href` is what makes it typed.',
  'router.exampleTitle': 'The table, and a link',
  'router.exampleDescription':
    'The table lives in one place. Pages never import it — a typed link needs only the pattern string.',
  'router.docsTitle': 'Documentation',
  'router.docsDescription':
    'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/router/docs/`.',
  'static.description':
    'Builds an application into files. Every route is rendered ahead of time, and what ships is a directory a static host can serve — no server at run time.',
  'static.featuresTitle': 'Features',
  'static.featureRoutes': 'routes/ is the URL space',
  'static.featureRoutesDescription':
    'The directory tree is the pathname space: page/layout/not-found, `[param]`, `(group)`, and `_`-prefixed privates. Anything outside the grammar fails the build.',
  'static.featureGenerated': 'The wiring is not yours to write',
  'static.featureGeneratedDescription':
    'The route table and the typed-path wiring into router and state are generated — as ordinary source using the public API, readable in a diff.',
  'static.featureBoundary': 'Boundaries are checked',
  'static.featureBoundaryDescription':
    "Execution is declared with React's own `'use client'`. The build fails the moment a `.server` module reaches the client bundle, so secrets cannot cross however many imports sit in between.",
  'static.featureFiles': 'The mode is the dependency',
  'static.featureFilesDescription':
    'Installing this package is what makes the application static: Server Actions and request-time data are not rules to remember but APIs that do not exist. Parameterised routes must be enumerated, or the build stops.',
  'static.exampleTitle': 'Directories are the URL',
  'static.exampleDescription':
    'The routes/ tree is the pathname space; the table and the type wiring are generated from it.',
  'static.docsTitle': 'Documentation',
  'static.docsDescription':
    'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/static/docs/`.',
  'server.description':
    'Runs an application. Pages are rendered per request, so they can depend on the request, answer with real HTTP status codes, and receive Server Actions.',
  'server.featuresTitle': 'Features',
  'server.featureRequest': 'The request is available',
  'server.featureRequestDescription':
    "Parameter values arrive with the request, so nothing has to be enumerated ahead of time. An unknown URL gets your not-found page under a genuine 404 rather than the host's error page.",
  'server.featureRoutes': 'routes/ is the URL space',
  'server.featureRoutesDescription':
    'The directory tree is the pathname space: page/layout/not-found, `[param]`, `(group)`, and `_`-prefixed privates. Anything outside the grammar fails the build.',
  'server.featureActions': 'Forms have somewhere to arrive',
  'server.featureActionsDescription':
    'Server Actions have a destination. Paired with @k8ordo/form, the validation and the messages come from the same single schema.',
  'server.featureSameHandler': 'The same handler as static',
  'server.featureSameHandlerDescription':
    'The function that turns a request into a page is identical; only when it is called differs. If a page renders differently under the two modes, something has leaked.',
  'server.exampleTitle': 'A Server Action',
  'server.exampleDescription':
    'A function marked `use server` is callable from the client, and runs on the server. The same form still works with no JavaScript at all.',
  'server.docsTitle': 'Documentation',
  'server.docsDescription':
    'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/server/docs/`.',
  'footer.tagline':
    'React libraries that use Baseline features without holding back.',
  'footer.typesetting': 'Typeset in Noto Sans JP & M PLUS 2',
  'nav.openMenu': 'Open menu',
  'nav.ai': 'AI',
  'nav.aiAgents': 'AI Agents',
  'ai.description':
    'k8ordo UI ships three surfaces for AI products: UI parts for composing chat screens, adapters that let LLMs generate UI constrained to k8ordo UI components, and documentation surfaces for AI coding agents.',
  'ai.chatSummary':
    'Presentational parts — Conversation, Message and PromptInput — for composing chat screens.',
  'ai.generativeUiSummary':
    'json-render / OpenUI adapters that let LLMs generate UI using only k8ordo UI components.',
  'ai.agentsSummary':
    'Documentation surfaces that feed the design guide, references and props to AI coding agents.',
  'aiAgents.introduction':
    'k8ordo UI ships surfaces meant for AI coding agents: the design guide, the component reference, the tokens and the props — each generated from the implementation.',
  'aiAgents.setupTitle': 'Point your agent at the docs',
  'aiAgents.setupDescription':
    'The docs ship inside the npm package, so an agent always reads the version you installed. Paste this into your project’s CLAUDE.md / AGENTS.md and the setup is done.',
  'aiAgents.surfacesTitle': 'Published surfaces',
  'aiAgents.surfacesDescription':
    'Each is available both inside the package (node_modules) and from this site.',
  'aiAgents.surfaceGuide': 'The design guide — the entry point',
  'aiAgents.surfaceReference': 'Reference for components, hooks and helpers',
  'aiAgents.surfaceIndex': 'Documentation index for LLMs',
  'aiAgents.surfaceTokens': 'Design token spec (generated from CSS)',
  'aiAgents.surfaceProps':
    'Props of every component (generated from the types)',
  'aiAgents.surfaceMcp': 'MCP endpoint of the published Storybook',
  'aiAgents.mcpTitle': 'Query Storybook over MCP',
  'aiAgents.mcpDescription':
    'So an agent looks up real stories and rendered props instead of recalling them. Add it to your MCP client config.',
  'aiAgents.generatedTitle': 'What is generated',
  'aiAgents.generatedDescription':
    'Props come from the component types and tokens from the CSS. CI fails when either drifts from the implementation, so the docs cannot quietly rot.',
  'generativeUi.introduction':
    'k8ordo UI ships official adapters so an LLM can generate UIs constrained to these components, via json-render or OpenUI. Generate the prompt on the server, validate the output, and render it on the client.',
  'generativeUi.promptTitle': 'Generate the prompt (server)',
  'generativeUi.promptDescription':
    'The catalog is server-safe. Generate the system prompt in a Server Component, and inject cross-cutting rules with `uiRules`.',
  'generativeUi.renderTitle': 'Render (client)',
  'generativeUi.renderDescription':
    '`JsonRenderUI` wires the provider, renderer, and registry for you — just pass a spec.',
  'generativeUi.validateTitle': 'Validate & repair LLM output',
  'generativeUi.validateDescription':
    '`validateGeneratedSpec` auto-fixes, checks structure, and validates props per component, returning a ready-to-resend repair prompt on failure.',
  'generativeUi.typedTitle': 'Typed specs',
  'generativeUi.typedDescription':
    'Write specs with `satisfies UISpec` so component names and props are checked at compile time.',
  'aiChat.introduction':
    'Presentational building blocks for AI chat UIs. They hold no fetching or message state — you pass data in and compose them with `messages.map()`, so they connect to the AI SDK or your own backend. Import from `@k8ordo/ui/ai`.',
  'aiChat.demoTitle': 'Demo',
  'aiChat.demoDescription':
    'A working chat screen. Pick a suggestion or type a message and send it — bubbles stack up in the conversation, and reasoning and tool calls fold into collapsible blocks.',
  'aiChat.suggestionTitle': 'Suggestions',
  'aiChat.suggestionDescription':
    '`Suggestion` lays out canned prompts as chips and passes the selected value straight to your send handler.',
  'aiChat.overviewTitle': 'Compose a conversation',
  'aiChat.overviewDescription':
    '`Conversation` provides the scroll region with stick-to-bottom and a scroll-to-latest button; `Message` renders the bubble per role; `PromptInput` is the composer. You own the message list.',
  'aiChat.inputTitle': 'Prompt input (IME-safe)',
  'aiChat.inputDescription':
    'Enter sends, Shift+Enter inserts a newline, and the Enter that confirms an IME composition never submits. `status` switches the button between send and stop.',
  'aiChat.responseTitle': 'Streaming Markdown',
  'aiChat.responseDescription':
    '`Response` renders streaming Markdown and tolerates unterminated blocks. It lives in a separate subpath and needs the `streamdown` optional peer plus its stylesheet.',
  'aiChat.toolTitle': 'Tool calls & reasoning',
  'aiChat.toolDescription':
    '`ToolInvocation` and `Reasoning` show collapsible tool activity and thinking. Their `state` vocabulary matches the AI SDK tool part states.',
  'aiChat.aiSdkTitle': 'AI SDK integration',
  'aiChat.aiSdkDescription':
    '`mapMessageParts` (from `@k8ordo/ui/ai-sdk`) turns an AI SDK `UIMessage.parts` array into a flat list you render yourself. It needs the `ai` optional peer.',
  'aiChat.jsonRenderTitle': 'Generative UI inside a bubble',
  'aiChat.jsonRenderDescription':
    'Because Message.Content takes any children, you can render an LLM-generated UI spec inside a bubble with the json-render registry — generative UI delivered straight into the conversation.',
  'aiChat.propsDescription':
    'Props generated from the component types. Collapsible components (Reasoning / ToolInvocation) support both controlled and uncontrolled usage via isOpen / defaultOpen / onChange.',
  'aiChat.demo.greeting':
    'Hi! Ask me anything about the k8ordo UI AI chat components.',
  'aiChat.demo.seedQuestion':
    'Where should I start when building an AI chat in React?',
  'aiChat.demo.seedReasoning':
    'The conversation area, message bubbles, and the input are the foundation. Markdown and tool views can come later.',
  'aiChat.demo.seedToolOutput':
    'Starting with Conversation, Message, and PromptInput is recommended.',
  'aiChat.demo.seedAnswer':
    'Start with Conversation, Message, and PromptInput to frame the conversation, then add Response (Markdown) and ToolInvocation on top.',
  'aiChat.demo.reply': 'Got it — let me pull together the relevant docs.',
  'aiChat.demo.suggestionIme': 'Tell me about IME support',
  'aiChat.demo.suggestionStreaming': 'How does streaming rendering work?',
  'aiChat.demo.suggestionTool': 'Show me a tool call example',
  'aiChat.demo.placeholder': 'Type a message…',
  'generativeUi.openuiTitle': 'OpenUI',
  'generativeUi.openuiDescription':
    'OpenUI renders a DSL string with the `library`. Generate the prompt on the server with the dedicated `openui/prompt` entry.',
  'getStarted.introduction':
    'k8ordo UI is a UI component library built with React 19. Interactive elements like forms and cards feel approachable with rounded shapes and generous spacing, while informational elements stay crisp and clear. Calm but never boring UI.',
  'getStarted.installationTitle': 'Installation',
  'getStarted.installationDescription':
    'Install with your preferred package manager.',
  'getStarted.setupTitle': 'Setup',
  'getStarted.setupDescription':
    'After installation, complete the following two configuration steps.',
  'getStarted.setupCssDescription':
    'Import the prebuilt CSS at your application entry point. No Tailwind CSS setup is required.',
  'getStarted.setupCssTailwindDescription':
    'Projects using Tailwind CSS 4 can import the source entry instead, which also makes the design tokens available as Tailwind classes in your own markup.',
  'getStarted.setupProviderDescription':
    'Wrap your application with UIProvider.',
  'getStarted.usageTitle': 'Usage',
  'getStarted.usageDescription':
    'Once setup is complete, you can import and use components.',
  'getStarted.requirementsTitle': 'Requirements',
  'getStarted.requirementsDescription':
    'k8ordo UI requires the following peer dependencies.',
  'getStarted.nextStepsTitle': 'Next Steps',
  'getStarted.nextStepsComponents':
    'Browse the component catalog to discover available UI parts',
  'getStarted.nextStepsTheming': 'Learn how to customize the theme',
  'getStarted.nextStepsI18n':
    'Switch the built-in wording to English or replace it',
  'getStarted.nextStepsStorybook':
    'View detailed documentation for each component in Storybook',
  'getStarted.packageManagerLabel': 'Package manager',
  'catalog.searchPlaceholder': 'Filter by name or description',
  'catalog.noResults': 'No matching items.',
  'components.description': 'A catalog of UI components provided by k8ordo UI.',
  'components.categoryButtons': 'Buttons',
  'components.categoryNavigation': 'Navigation',
  'components.categoryForms': 'Forms',
  'components.categoryDataDisplay': 'Data Display',
  'components.categoryFeedback': 'Feedback',
  'components.categoryOverlays': 'Overlays',
  'components.categoryLayout': 'Layout',
  'components.categoryMedia': 'Media',
  'components.common.storybookLink': 'View in Storybook',
  'components.common.importTitle': 'Import',
  'components.common.usageTitle': 'Usage',
  'components.common.propsTitle': 'Props',
  'components.common.inheritsLabel':
    'Type base (some attrs are managed internally):',
  'components.common.messagesNote':
    'Props whose default is messages.* fall back to the message dictionary. To change them, see:',
  'components.button.description':
    'A button component that triggers user actions.',
  'components.button.variantsTitle': 'Variants',
  'components.button.colorsTitle': 'Colors',
  'components.button.sizesTitle': 'Sizes',
  'components.button.iconsTitle': 'With Icons',
  'components.button.fullWidthTitle': 'Full Width',
  'components.button.disabledTitle': 'Disabled',
  'components.button.renderItemTitle': 'Render as Link',
  'components.iconButton.description': 'An icon-only button component.',
  'components.iconButton.sizesTitle': 'Sizes',
  'components.iconButton.backgroundsTitle': 'Backgrounds',
  'components.iconButton.disabledTitle': 'Disabled',
  'components.iconButton.renderItemTitle': 'Render as Link',
  'components.anchor.description': 'A text link component.',
  'components.anchor.openInNewTabTitle': 'Open in New Tab',
  'components.anchor.renderAnchorTitle': 'Swap element via render prop',
  'components.anchor.renderAnchorDescription':
    'Pass renderAnchor to swap the element to a framework-specific anchor (e.g. Next.js Link, react-router Link). Spread all received props onto the replacement element.',
  'components.textField.description': 'A text input field.',
  'components.textField.placeholderTitle': 'Placeholder',
  'components.textField.disabledTitle': 'Disabled',
  'components.textField.invalidTitle': 'Invalid',
  'components.textarea.description': 'A multi-line text input field.',
  'components.textarea.rowsTitle': 'Rows',
  'components.textarea.autoResizeTitle': 'Auto Resize',
  'components.textarea.disabledTitle': 'Disabled',
  'components.textarea.invalidTitle': 'Invalid',
  'components.numberField.description': 'A number input field.',
  'components.numberField.stepPrecisionTitle': 'Step & Precision',
  'components.numberField.minMaxTitle': 'Min / Max',
  'components.numberField.disabledTitle': 'Disabled',
  'components.numberField.invalidTitle': 'Invalid',
  'components.select.description': 'A select box to choose from options.',
  'components.select.disabledTitle': 'Disabled',
  'components.select.invalidTitle': 'Invalid',
  'components.select.requiredTitle': 'Required',
  'components.select.defaultValueTitle': 'Default Value',
  'components.checkbox.description': 'A checkbox component.',
  'components.checkbox.defaultCheckedTitle': 'Default Checked',
  'components.checkbox.disabledTitle': 'Disabled',
  'components.checkbox.controlledTitle': 'Controlled',
  'components.checkboxCard.description':
    'A multi-select card group that makes each option a larger click target.',
  'components.checkboxCard.defaultValueTitle': 'Default Value',
  'components.checkboxGroup.description':
    'A group that manages multiple checkboxes as a single array value.',
  'components.checkboxGroup.defaultValueTitle': 'Default Value',
  'components.checkboxGroup.disabledTitle': 'Disabled',
  'components.switch.description':
    'A switch component for binary on/off state.',
  'components.switch.defaultCheckedTitle': 'Default Checked',
  'components.switch.disabledTitle': 'Disabled',
  'components.switch.controlledTitle': 'Controlled',
  'components.passwordInput.description':
    'A password field with a built-in visibility toggle.',
  'components.passwordInput.controlledTitle': 'Controlled',
  'components.passwordInput.disabledTitle': 'Disabled',
  'components.radio.description': 'A radio button group.',
  'components.radio.disabledTitle': 'Disabled',
  'components.radio.defaultValueTitle': 'Default Value',
  'components.radioCard.description':
    'A single-select card group for larger, more descriptive choices.',
  'components.radioCard.defaultValueTitle': 'Default Value',
  'components.radioCard.formTitle': 'Form Integration',
  'components.radioCard.formDescription':
    'The cards are backed by real input[type=radio] elements, so passing name lets the browser group them and the selected value comes straight out of FormData.',
  'components.autocomplete.description':
    'A selection component with autocomplete.',
  'components.autocomplete.disabledTitle': 'Disabled',
  'components.autocomplete.invalidTitle': 'Invalid',
  'components.autocomplete.requiredTitle': 'Required',
  'components.autocomplete.multipleSelectionTitle': 'Multiple Selection',
  'components.slider.description':
    'A single-thumb slider input with a styled track and handle.',
  'components.slider.minMaxStepTitle': 'Min / Max / Step',
  'components.slider.disabledTitle': 'Disabled',
  'components.fileField.description': 'A file upload field.',
  'components.fileField.acceptTypesTitle': 'Accept Types',
  'components.fileField.multipleFilesTitle': 'Multiple Files',
  'components.fileField.disabledTitle': 'Disabled',
  'components.fileField.invalidTitle': 'Invalid',
  'components.formControl.description':
    'A form control wrapper providing labels and error display.',
  'components.formControl.helpTextTitle': 'Help Text',
  'components.formControl.errorTextTitle': 'Error Text',
  'components.formControl.requiredTitle': 'Required',
  'components.formControl.disabledTitle': 'Disabled',
  'components.form.description':
    'A form wrapper that accepts an action prop and handles submission via the Async React form action pattern.',
  'components.form.actionStateTitle': 'With useActionState',
  'components.accordion.description': 'A collapsible content panel.',
  'components.accordion.defaultOpenTitle': 'Default Open',
  'components.avatar.description': 'A profile image component with fallback.',
  'components.avatar.withImageTitle': 'With Image',
  'components.avatar.sizesTitle': 'Sizes',
  'components.badge.description': 'A compact status or category label.',
  'components.badge.tonesTitle': 'Tones',
  'components.badge.variantsTitle': 'Variants',
  'components.badge.interactiveTitle': 'Interactive',
  'components.card.description': 'A card for grouping content.',
  'components.card.widthTitle': 'Width',
  'components.card.interactiveDescription':
    'With the interactive prop, the card scales on hover and active. Use it to make the whole card a link or button.',
  'components.code.description': 'An inline code display component.',
  'components.code.colorDetectionTitle': 'Color Detection',
  'components.table.description':
    'A semantic table component with horizontal overflow support.',
  'components.table.emptyStateTitle': 'Empty State',
  'components.listBox.description': 'A dropdown list selection component.',
  'components.progress.description': 'A progress bar component.',
  'components.progress.differentValuesTitle': 'Different Values',
  'components.progress.withLabelTitle': 'With Label',
  'components.heading.description': 'A heading component.',
  'components.heading.typesTitle': 'Types',
  'components.heading.lineClampTitle': 'Line Clamp',
  'components.alert.description':
    'An alert that displays status-based messages.',
  'components.alert.statusesTitle': 'Statuses',
  'components.alert.dismissibleTitle': 'Dismissible',
  'components.alert.actionTitle': 'Action (Text Link)',
  'components.skeleton.description':
    'A loading placeholder for content that has not arrived yet.',
  'components.skeleton.shapesTitle': 'Shapes',
  'components.skeleton.sizesTitle': 'Sizes',
  'components.skeleton.animationTitle': 'Animation',
  'components.spinner.description': 'A loading spinner.',
  'components.spinner.sizesTitle': 'Sizes',
  'components.toast.description':
    'A toast for temporary notification messages.',
  'components.tooltip.description':
    'A tooltip that shows supplementary info on hover.',
  'components.dialog.description': 'A dialog component.',
  'components.drawer.description':
    'A drawer that slides in from the screen edge.',
  'components.modal.description': 'A modal dialog component.',
  'components.popover.description': 'Floating content anchored to an element.',
  'components.dropdownMenu.description': 'A dropdown menu component.',
  'components.dropdownMenu.iconTriggerTitle': 'With Icon Trigger',
  'components.separator.description': 'A separator / divider component.',
  'components.separator.orientationsTitle': 'Orientations',
  'components.separator.colorsTitle': 'Colors',
  'components.stack.description':
    'Layout primitive that arranges children in a row or column with consistent gaps.',
  'components.stack.directionTitle': 'Direction',
  'components.stack.gapTitle': 'Gap',
  'components.stack.alignTitle': 'Align & justify',
  'components.grid.description':
    'Layout primitive that arranges children on a CSS grid, with a fixed column count or auto-fill / auto-fit.',
  'components.grid.colsTitle': 'Fixed columns',
  'components.grid.autoFillTitle': 'Auto-fill',
  'components.grid.autoFillDescription':
    'With cols="auto-fill" or "auto-fit", minItemSize controls the minimum width of each cell so the grid reflows responsively.',
  'components.tabs.description': 'A tab switching component.',
  'components.tabs.defaultSelectedTitle': 'Default Selected',
  'components.breadcrumb.description': 'A breadcrumb navigation component.',
  'components.breadcrumb.sizesTitle': 'Sizes',
  'components.pagination.description':
    'A minimal pagination component with prev/next controls and current position indicator.',
  'components.pagination.disabledTitle': 'Disabled',
  'components.scrollLinked.description':
    'A progress bar linked to scroll position.',
  'components.icons.description':
    'A catalog of icon components provided by k8ordo UI.',
  'components.icons.sizesTitle': 'Sizes',
  'components.icons.propsDescription':
    'Every icon accepts a shared `size` prop. Only `ChevronIcon` (direction) and `AlertIcon` (status) take additional props.',
  'components.common.basicUsageTitle': 'Basic Usage',
  'components.modal.sideTitle': 'Side',
  'components.toast.useToastTitle': 'useToast Hook',
  'components.popover.placementTitle': 'Placement',
  'components.tooltip.placementTitle': 'Placement',
  'components.listBox.sizesTitle': 'Sizes',
  'components.listBox.iconTriggerTitle': 'With Icon Trigger',
  'components.modal.defaultOpenTitle': 'Default Open',
  'components.modal.portalRootTitle': 'Top Layer & Portals',
  'components.modal.portalRootDescription':
    'Modal renders in the browser top layer (a `dialog` element), so anything portaled to `document.body` ends up hidden behind it. Modal provides its own `dialog` element as a portal root via context — read it with `usePortalRoot` and portal there so floating UI stays on top inside a Modal. `useToast` inside a Modal already uses this mechanism automatically; you only need it for your own portals.',
  'components.dropdownMenu.sizesTitle': 'Sizes',
  'components.dropdownMenu.placementTitle': 'Placement',
  'components.drawer.customContentTitle': 'With Custom Content',
  'components.dialog.alertDialogTitle': 'Alert Dialog',
  'components.alert.multipleMessagesTitle': 'Multiple Messages',
  'components.accordion.multipleDefaultOpenTitle': 'Multiple Default Open',
  'components.breadcrumb.currentPageTitle': 'Current Page',
  'components.toast.closeAllTitle': 'Close All',
  'components.scrollLinked.windowScrollTitle': 'Window Scroll',
  'hooks.description': 'A catalog of custom hooks provided by k8ordo UI.',
  'hooks.categoryDomInteraction': 'DOM Interaction',
  'hooks.categoryStateStorage': 'State & Storage',
  'hooks.categoryTiming': 'Timing',
  'hooks.categoryUtility': 'Utility',
  'hooks.categoryObserver': 'Observer',
  'hooks.common.importTitle': 'Import',
  'hooks.common.usageTitle': 'Usage',
  'hooks.common.basicUsageTitle': 'Basic Usage',
  'hooks.common.parametersTitle': 'Parameters',
  'hooks.common.returnValueTitle': 'Return Value',
  'hooks.useClickAway.description':
    'A hook that detects clicks outside a specified element.',
  'hooks.useClient.description':
    'A hook that returns whether the code is running on the client.',
  'hooks.useClipboard.description':
    'A hook that provides clipboard read/write operations.',
  'hooks.useHash.description':
    'A hook that tracks the URL hash and reacts to changes.',
  'hooks.useInterval.description':
    'A hook that executes a callback at regular intervals.',
  'hooks.useLocalStorage.description':
    'A hook that persists state in localStorage with cross-tab sync.',
  'hooks.useLocalStorage.removeTitle': 'Remove Value',
  'hooks.useSessionStorage.description':
    'A hook that persists state in sessionStorage.',
  'hooks.useSessionStorage.removeTitle': 'Remove Value',
  'hooks.useResize.description':
    'A hook that observes element size changes via ResizeObserver.',
  'hooks.useScrollDirection.description':
    'A hook that detects the current scroll direction.',
  'hooks.useScrollDirection.targetTitle': 'Target element',
  'hooks.useScrollDirection.bodyNotScrollableNote':
    "This page's body does not scroll, so the behavior can't be tried here. Please verify on an actual scrollable page.",
  'hooks.useStep.description':
    'A hook for step-based navigation with keyboard support.',
  'hooks.useTimeout.description':
    'A hook that executes a callback after a specified delay.',
  'hooks.useWindowResize.description':
    'A hook that listens to window resize events.',
  'hooks.useBreakpoint.description':
    'A hook that checks whether the viewport matches a given breakpoint.',
  'hooks.useDebouncedTransition.description':
    'A hook that runs an action after a delay using startTransition and AbortController.',
  'hooks.useDeferredDebounce.description':
    'A hook that wraps useDeferredValue and returns the value together with a pending flag.',
  'hooks.useDisclosure.description':
    'A hook for managing open/close state with open, close, and toggle actions.',
  'hooks.useIntersectionObserver.description':
    'A hook that observes element visibility via IntersectionObserver.',
  'hooks.useInView.description':
    'A hook that returns whether an element is currently visible in the viewport.',
  'hooks.useWindowSize.description':
    'A hook that returns the current window dimensions.',
  'hooks.useScrollLock.description':
    'A hook that locks and unlocks scroll on the body or a specified element.',
  'hooks.useScrollLock.targetTitle': 'Target element',
  'hooks.useScrollLock.bodyNotScrollableNote':
    "This page's body does not scroll, so the behavior can't be tried here. Please verify on an actual scrollable page.",
  'hooks.useHover.description':
    'A hook that detects hover state of an element.',
  'hooks.useControllableState.description':
    'A hook that manages controlled/uncontrolled component state.',
  'hooks.useWritingMode.description':
    "A hook that observes an element's writing-mode and returns either horizontal or vertical.",
  'helpers.description': 'A catalog of helper functions provided by k8ordo UI.',
  'helpers.categoryStyling': 'Styling',
  'helpers.categoryReact': 'React',
  'helpers.common.importTitle': 'Import',
  'helpers.common.usageTitle': 'Usage',
  'helpers.common.basicUsageTitle': 'Basic Usage',
  'helpers.common.parametersTitle': 'Parameters',
  'helpers.common.returnValueTitle': 'Return Value',
  'helpers.cn.description':
    'A class name utility combining clsx and tailwind-merge.',
  'helpers.mergeRefs.description':
    'A utility that merges multiple refs into a single element.',
  'helpers.mergeProps.description':
    'A utility that merges multiple props together, properly combining className and event handlers.',
  'helpers.chain.description':
    'A utility that creates a function that calls multiple functions in order.',
  'helpers.createSafeContext.description':
    'A utility that creates a Context that throws clearly when accessed outside its Provider.',
  'theming.introduction':
    'k8ordo UI uses a CSS variable-based design token system. It supports both light and dark modes and is easy to customize.',
  'theming.colorPaletteTitle': 'Color Palette',
  'theming.colorPaletteDescription':
    'There are 10 base color families, each with 11 shades from 50 to 950.',
  'theming.semanticColorsTitle': 'Semantic Colors',
  'theming.semanticColorsDescription':
    'Purpose-specific color tokens derived from the base colors. They automatically adapt when switching themes.',
  'theming.foregroundTitle': 'Foreground',
  'theming.backgroundTitle': 'Background',
  'theming.borderTitle': 'Border',
  'theming.brandColorsTitle': 'Brand Colors',
  'theming.brandColorsDescription':
    'Primary uses Teal and Secondary uses Cyan as their base brand colors.',
  'theming.token.fg-base': 'Default text',
  'theming.token.fg-subtle': 'Faintest text such as placeholders',
  'theming.token.fg-mute': 'Supporting text such as descriptions and captions',
  'theming.token.fg-inverse': 'Text placed on inverse backgrounds (bg-inverse)',
  'theming.token.fg-info': 'Informational message text',
  'theming.token.fg-success': 'Success message text',
  'theming.token.fg-warning': 'Warning message text',
  'theming.token.fg-error': 'Error message text',
  'theming.token.bg-base': 'Primary surfaces such as cards',
  'theming.token.bg-raised': 'Elevated surfaces such as menus and popovers',
  'theming.token.bg-surface': 'The page background',
  'theming.token.bg-subtle': 'Recessed areas such as section backgrounds',
  'theming.token.bg-mute': 'Hover-state background',
  'theming.token.bg-emphasize': 'Active-state background',
  'theming.token.bg-inverse': 'Inverse background, paired with fg-inverse',
  'theming.token.bg-info': 'Informational message background',
  'theming.token.bg-success': 'Success message background',
  'theming.token.bg-warning': 'Warning message background',
  'theming.token.bg-error': 'Error message background',
  'theming.token.border-base': 'Default borders such as form fields',
  'theming.token.border-subtle': 'Faintest hairline borders',
  'theming.token.border-mute': 'Subdued borders and separators',
  'theming.token.border-emphasize': 'Emphasized borders, e.g. on hover',
  'theming.token.border-inverse': 'Borders on inverse surfaces',
  'theming.token.border-info': 'Info borders, also used for focus rings',
  'theming.token.border-success': 'Success-state borders',
  'theming.token.border-warning': 'Warning-state borders',
  'theming.token.border-error': 'Error-state borders',
  'theming.token.primary-fg': 'Primary text and icons',
  'theming.token.primary-bg': 'Primary fill, e.g. solid buttons',
  'theming.token.primary-bg-subtle':
    'Faintest primary background, e.g. selected states',
  'theming.token.primary-bg-mute': 'Muted primary background',
  'theming.token.primary-bg-emphasize':
    'Emphasized primary background, e.g. on hover',
  'theming.token.primary-border': 'Primary borders and accent lines',
  'theming.token.secondary-fg': 'Secondary text and icons',
  'theming.token.secondary-bg': 'Secondary fill',
  'theming.token.secondary-bg-subtle': 'Faintest secondary background',
  'theming.token.secondary-bg-mute': 'Muted secondary background',
  'theming.token.secondary-bg-emphasize':
    'Emphasized secondary background, e.g. on hover',
  'theming.token.secondary-border': 'Secondary borders',
  'theming.token.group-primary': 'Chart series color 1',
  'theming.token.group-secondary': 'Chart series color 2',
  'theming.token.group-tertiary': 'Chart series color 3',
  'theming.token.group-quaternary': 'Chart series color 4',
  'theming.typographyTitle': 'Typography',
  'theming.typographyDescription':
    'Design tokens for text sizes, font weights, letter spacing, and line heights.',
  'theming.textSizesTitle': 'Text Sizes',
  'theming.fontWeightsTitle': 'Font Weights',
  'theming.letterSpacingTitle': 'Letter Spacing',
  'theming.lineHeightTitle': 'Line Height',
  'theming.shadowTitle': 'Shadow',
  'theming.shadowDescription': 'Design tokens for box shadows.',
  'theming.borderRadiusTitle': 'Border Radius',
  'theming.borderRadiusDescription': 'Design tokens for border radius values.',
  'theming.darkModeTitle': 'Dark Mode',
  'theming.darkModeDescription':
    'Add the dark class to the root element to enable dark mode. Semantic color tokens automatically switch to their dark mode values.',
  'theming.customizeTitle': 'Overriding Tokens',
  'theming.customizeDescription':
    'Every token is a CSS variable, so redefining the same variable in CSS loaded after the k8ordo UI stylesheet overrides it. The base color variables (such as `--purple-200`) are also defined, so swapping the references switches the whole brand color at once. Redefine the dark mode values under `.dark`.',
  'theming.customizeValueDescription':
    'You can also assign a raw value directly instead of referencing a shade.',
  'theming.spacingTitle': 'Spacing',
  'theming.spacingDescription':
    'The spacing scale. The base unit is 0.25rem (4px), and p-{n} or gap-{n} computes to n × 0.25rem.',
  'theming.breakpointsTitle': 'Breakpoints',
  'theming.breakpointsDescription': 'Responsive breakpoints.',
  'theming.zIndexTitle': 'Z-Index Layers',
  'theming.zIndexDescription':
    'A three-tier scale that defines stacking order for overlay components. Anchored floating UI (Popover / DropdownMenu / ListBox / Tooltip) sits on overlay, Modal / Drawer on modal, and Toast on toast.',
  'i18n.introduction':
    'Wording the components render on their own — close button labels, the required badge, the loading announcement — comes from a message dictionary. Replace the dictionary and the language changes without touching your own code.',
  'i18n.defaultTitle': 'Japanese by default',
  'i18n.defaultDescription':
    'No setup required. UIProvider uses the Japanese dictionary, and components fall back to the same Japanese wording even without a provider.',
  'i18n.englishTitle': 'Switching to English',
  'i18n.englishDescription':
    'Import en from @k8ordo/ui/i18n and pass it to messages. ja ships from the same entry point.',
  'i18n.overrideTitle': 'Overriding part of a dictionary',
  'i18n.overrideDescription':
    'messages is a Partial<Messages>. Only the keys you pass are replaced; the rest fall back to the Japanese defaults. To start from English instead, spread en first and layer your changes on top.',
  'i18n.priorityTitle': 'Resolution order',
  'i18n.priorityDescription':
    'Three sources can decide a string, and they win in the order prop > dictionary > default. Per-instance props (such as the Spinner label) always beat the dictionary, so reach for them when only one place should read differently.',
  'i18n.customTitle': 'Writing your own dictionary',
  'i18n.customDescription':
    'Annotate with the Messages type and missing or misspelled keys become compile errors — including when the library adds a key.',
  'i18n.keysTitle': 'Key reference',
  'i18n.keysDescription':
    'Every key in Messages. The values below are read from the shipped dictionaries themselves.',
  'i18n.keyColumn': 'Key',
  'i18n.usedByColumn': 'Used by',
  'i18n.jaColumn': 'ja (default)',
  'i18n.enColumn': 'en',
  'sideNav.openNavigation': 'Open navigation',
  'common.switchToDarkMode': 'Switch to dark mode',
  'common.switchToLightMode': 'Switch to light mode',
  'common.switchToVerticalWriting': 'Switch to vertical preview',
  'common.switchToHorizontalWriting': 'Switch to horizontal preview',
  'notFound.title': 'Page not found',
  'notFound.description':
    'The URL may have changed, or the page may no longer exist.',
  'error.title': 'Something went wrong',
  'error.description': 'An unexpected error occurred.',
  'error.retry': 'Retry',
} as const satisfies Record<MessageKey, string>;
