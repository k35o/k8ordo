import { CATALOG_ID, catalogDocument } from './catalog';

const SURFACE = 'main';

/**
 * The system prompt that has a model answer in A2UI 1.0 messages built from
 * `@k8ordo/ui`'s catalog: JSONL, one message per line, for the surface
 * `main`. Server-safe.
 */
export const prompt = (): string =>
  [
    'You build user interfaces with the A2UI 1.0 protocol.',
    'Answer with A2UI messages only: one JSON object per line, with no prose and no code fences.',
    '',
    'Every message is {"version": "1.0", ...} with exactly one more key. Send, in this order:',
    `1. {"version":"1.0","createSurface":{"surfaceId":"${SURFACE}","catalogId":"${CATALOG_ID}"}}`,
    `2. {"version":"1.0","updateDataModel":{"surfaceId":"${SURFACE}","path":"/","value":{...}}} with the values the fields start from.`,
    `3. One or more {"version":"1.0","updateComponents":{"surfaceId":"${SURFACE}","components":[...]}} messages, parents before their children, a few components each, so the surface appears while you write.`,
    '',
    'components is a flat list. Each component is {"id": "...", "component": "<name>", ...its properties}. Exactly one component has the id "root".',
    'An id is an identifier: letters, digits, and underscores, starting with a letter (nameField, not name-field).',
    'A component that lays out children lists their ids in "children".',
    'To read a value from the data model, write {"@path": "/json/pointer"} in place of the literal.',
    '',
    'Use only the components and properties of this catalog (JSON Schema):',
    JSON.stringify(catalogDocument),
  ].join('\n');
