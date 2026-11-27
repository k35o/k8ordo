import { Catalog, MessageProcessor } from '@a2ui/web_core';
import { z } from 'zod';

import { CATALOG_ID, catalogDocument } from './catalog.ts';

const components = z.array(
  z.looseObject({ id: z.string(), component: z.string() }),
);

/** The input of a tool that shows a screen: A2UI 1.0 components, and the data model they start from. */
export const screenInput = z.object({
  components: components.describe(
    'The A2UI 1.0 components of the screen, as one flat list: parents before their children, and exactly one with the id "root".',
  ),
  dataModel: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      'The A2UI data model the screen starts from: the values its fields show, at the paths they are bound to.',
    ),
});

export type ScreenInput = z.infer<typeof screenInput>;

/** The input of a tool that changes a screen shown before, in place. */
export const screenUpdate = z.object({
  components: components
    .optional()
    .describe(
      'The components to add or replace, matched by id. To remove one, leave its id out of the children of its parent.',
    ),
  values: z
    .record(z.string(), z.unknown())
    .optional()
    .describe(
      'Values to set in the data model, keyed by JSON pointer, such as {"/status": "sent"}. The values you leave out keep what the user entered.',
    ),
});

export type ScreenUpdate = z.infer<typeof screenUpdate>;

/** A call that shows a screen as the A2UI surface `screen`, or changes that surface. */
export type ScreenStep =
  | { kind: 'show'; screen: string; input: ScreenInput }
  | { kind: 'update'; screen: string; input: ScreenUpdate };

/** How to write a screen, for the description of a tool that shows one. */
export const screenRules: readonly string[] = [
  'Write the screen as A2UI 1.0 components:',
  '- components is a flat list. Each component is {"id": "...", "component": "<name>", ...its properties}. Exactly one has the id "root". A component that lays out children lists their ids in "children".',
  '- An id is an identifier: letters, digits, and underscores, starting with a letter (nameField, not name-field).',
  '- dataModel holds the values the fields start from. Bind the value of every field to it with {"@path": "/json/pointer"}, and read values from it the same way.',
  '- To let the user act, set the event property of a component (press) to {"event": {"name": "...", "context": {...}}}. name says what the user did, such as "submitSignup"; put in context what you need to know, reading what the user entered with {"@path": "/..."}.',
];

/** The components a screen is written with, for the description of a tool that shows one. */
export const catalogLines: readonly string[] = [
  'Use only the components and properties of this catalog (JSON Schema):',
  JSON.stringify(catalogDocument),
];

const VERSION = '1.0';

/** The A2UI messages that carry out a step. */
export const screenMessages = (
  step: ScreenStep,
): Array<Record<string, unknown>> => {
  const surfaceId = step.screen;
  if (step.kind === 'show') {
    return [
      { version: VERSION, createSurface: { surfaceId, catalogId: CATALOG_ID } },
      {
        version: VERSION,
        updateDataModel: {
          surfaceId,
          path: '/',
          value: step.input.dataModel ?? {},
        },
      },
      {
        version: VERSION,
        updateComponents: { surfaceId, components: step.input.components },
      },
    ];
  }
  const { components: changed, values = {} } = step.input;
  return [
    ...(changed === undefined
      ? []
      : [
          {
            version: VERSION,
            updateComponents: { surfaceId, components: changed },
          },
        ]),
    ...Object.entries(values).map(([path, value]) => ({
      version: VERSION,
      updateDataModel: { surfaceId, path, value },
    })),
  ];
};

const schemas = Catalog.fromJson(catalogDocument);

/**
 * What A2UI refuses in `step`, carried out after the steps `before`, checked
 * against the catalog's schemas only.
 */
export const screenIssues = (
  step: ScreenStep,
  before: readonly ScreenStep[] = [],
): string[] => {
  if (
    step.kind === 'update' &&
    !before.some(
      ({ kind, screen }) => kind === 'show' && screen === step.screen,
    )
  ) {
    return [`There is no screen "${step.screen}".`];
  }
  // A2UI の処理系は、カタログに無い部品も root の無い画面も咎めないので、ここで見る
  const unknown = (step.input.components ?? [])
    .filter(
      ({ component }) => !Object.hasOwn(catalogDocument.components, component),
    )
    .map(({ id, component }) => `[${id}] ${component} is not in the catalog.`);
  const rootless =
    step.kind === 'show' &&
    !step.input.components.some(({ id }) => id === 'root')
      ? ['No component has the id "root".']
      : [];
  const processor = new MessageProcessor([schemas]);
  for (const message of before.flatMap(screenMessages)) {
    processor.processMessagesWithErrors(message);
  }
  return [
    ...unknown,
    ...rootless,
    ...screenMessages(step).flatMap((message) =>
      processor
        .processMessagesWithErrors(message)
        .map(({ error }) => `${error.code}: ${error.message}`),
    ),
  ];
};
