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
  'home.title': 'k8ordo',
  'home.description':
    'A React component library for UI that is calm but never boring',
  'home.getStarted': 'Get Started',
  'home.viewComponents': 'Browse Components',
  'home.github': 'GitHub',
  'home.storybook': 'Storybook',
  'home.featuresTitle': 'Features',
  'home.featureReact': 'React 19',
  'home.featureReactDescription':
    'Built with the latest React 19. Supports modern patterns like Server Components and actions.',
  'home.featureTokens': 'Design Tokens',
  'home.featureTokensDescription':
    'One prebuilt CSS import and it just works — no Tailwind CSS setup required. Semantic tokens keep colors and spacing consistent, and light and dark modes switch seamlessly.',
  'home.featureTypeScript': 'TypeScript',
  'home.featureTypeScriptDescription':
    'Full type definitions included. Develop safely with editor autocompletion and compile-time type checking.',
  'home.featureAccessible': 'Accessibility',
  'home.featureAccessibleDescription':
    'Aiming for components that consider keyboard navigation and screen reader support based on WAI-ARIA patterns.',
  'home.featureMinimal': 'Soft & Sharp Design',
  'home.featureMinimalDescription':
    'Soft where you touch, sharp where you read. UI that speaks through whitespace and gentle forms.',
  'home.featureVerticalWriting': 'Vertical Writing Support',
  'home.featureVerticalWritingDescription':
    'Switch writing-mode with the `writing-v` utility and every component follows along on a vertical page. Preview the Japanese docs in vertical mode.',
  'common.language': 'Language',
  'footer.docs': 'Documentation',
  'footer.resources': 'Resources',
  'footer.tagline': 'Soft where you touch, precise where you read.',
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
    'The catalog is server-safe. Generate the system prompt in a Server Component, and inject cross-cutting rules with `arteOdysseyRules`.',
  'generativeUi.renderTitle': 'Render (client)',
  'generativeUi.renderDescription':
    '`JsonRenderUI` wires the provider, renderer, and registry for you — just pass a spec.',
  'generativeUi.validateTitle': 'Validate & repair LLM output',
  'generativeUi.validateDescription':
    '`validateGeneratedSpec` auto-fixes, checks structure, and validates props per component, returning a ready-to-resend repair prompt on failure.',
  'generativeUi.typedTitle': 'Typed specs',
  'generativeUi.typedDescription':
    'Write specs with `satisfies ArteSpec` so component names and props are checked at compile time.',
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
  'error.title': 'Something went wrong',
  'error.description': 'An unexpected error occurred.',
  'error.retry': 'Retry',
} as const satisfies Record<MessageKey, string>;
