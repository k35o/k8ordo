import { Catalog, MessageProcessor } from '@a2ui/web_core';
import { z } from 'zod';

import { CATALOG_ID, catalogDocument } from '../a2ui/catalog.ts';

export const SHOW_UI = 'show_ui';
export const APP_URI = 'ui://k8ordo/a2ui.html';

const SURFACE = 'main';

export const showUiInput = z.object({
  components: z
    .array(z.looseObject({ id: z.string(), component: z.string() }))
    .describe(
      'The A2UI 1.0 components of the screen, as one flat list: parents before their children, and exactly one with the id "root".',
    ),
  dataModel: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      'The A2UI data model the screen starts from: the values its fields show, at the paths they are bound to.',
    ),
});

export type ShowUiInput = z.infer<typeof showUiInput>;

export const showUiDescription = [
  'Shows the user an interactive screen in the conversation, drawn with @k8ordo/ui, a React design system. Use it whenever a form, a table, a choice, or other UI helps the user more than prose.',
  '',
  'Write the screen as A2UI 1.0 components:',
  '- components is a flat list. Each component is {"id": "...", "component": "<name>", ...its properties}. Exactly one has the id "root". A component that lays out children lists their ids in "children".',
  '- An id is an identifier: letters, digits, and underscores, starting with a letter (nameField, not name-field).',
  '- dataModel holds the values the fields start from. Bind the value of every field to it with {"@path": "/json/pointer"}, and read values from it the same way.',
  '- To let the user act, set the event property of a component (press) to {"event": {"name": "...", "context": {...}}}. name says what the user did, such as "submitSignup"; put in context what you need to know, reading what the user entered with {"@path": "/..."}.',
  '',
  'When the user acts, you receive a user message with the event, its context, and the whole data model. Answer it in prose, and call show_ui again when the next step needs a screen of its own. Each call shows a new screen; it does not change the one before.',
  '',
  'Use only the components and properties of this catalog (JSON Schema):',
  JSON.stringify(catalogDocument),
].join('\n');

export const messagesOf = ({ components, dataModel }: ShowUiInput) => [
  {
    version: '1.0',
    createSurface: { surfaceId: SURFACE, catalogId: CATALOG_ID },
  },
  {
    version: '1.0',
    updateDataModel: { surfaceId: SURFACE, path: '/', value: dataModel ?? {} },
  },
  { version: '1.0', updateComponents: { surfaceId: SURFACE, components } },
];

const schemas = Catalog.fromJson(catalogDocument);

/** What A2UI refuses in a `show_ui` call, checked against the catalog's schemas only. */
export const issuesOf = (input: ShowUiInput): string[] => {
  // A2UI の処理系は、カタログに無い部品も root の無い画面も咎めないので、ここで見る
  const unknown = input.components
    .filter(
      ({ component }) => !Object.hasOwn(catalogDocument.components, component),
    )
    .map(({ id, component }) => `[${id}] ${component} is not in the catalog.`);
  const rootless = input.components.some(({ id }) => id === 'root')
    ? []
    : ['No component has the id "root".'];
  const processor = new MessageProcessor([schemas]);
  return [
    ...unknown,
    ...rootless,
    ...messagesOf(input).flatMap((message) =>
      processor
        .processMessagesWithErrors(message)
        .map(({ error }) => `${error.code}: ${error.message}`),
    ),
  ];
};

export const reportOf = (action: unknown, dataModel: unknown): string =>
  [
    'The user acted on the screen.',
    `Action: ${JSON.stringify(action)}`,
    `State of the screen now: ${JSON.stringify(dataModel)}`,
  ].join('\n');

export const stateOf = (dataModel: unknown): string =>
  `State of the screen now: ${JSON.stringify(dataModel)}`;
