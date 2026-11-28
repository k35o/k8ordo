import {
  catalog as k8ordo,
  catalogNames,
  catalogRules,
} from '@k8ordo/ui/catalog';
import type { AnyCatalogEntry, CatalogName } from '@k8ordo/ui/catalog';
import { z } from 'zod';

/** The A2UI catalog ID of `@k8ordo/ui`. A2UI needs it to be unique, not to resolve. */
export const CATALOG_ID = 'https://ordo.k8o.me/a2ui/v1/catalog.json';

type JsonSchema = {
  type?: unknown;
  items?: JsonSchema;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
};

const COMMON_TYPES = 'common_types.json#/$defs';

const dynamicTypeOf = (field: JsonSchema | undefined): string => {
  switch (field?.type) {
    case 'string':
      return 'DynamicString';
    case 'number':
    case 'integer':
      return 'DynamicNumber';
    case 'boolean':
      return 'DynamicBoolean';
    case 'array':
      return field.items?.type === 'string'
        ? 'DynamicStringList'
        : 'DynamicValue';
    default:
      return 'DynamicValue';
  }
};

const componentOf = (name: CatalogName) => {
  const entry: AnyCatalogEntry = k8ordo[name];
  const json = z.toJSONSchema(entry.props, { io: 'input' }) as JsonSchema;
  const properties: Record<string, unknown> = {
    component: { const: name },
    ...json.properties,
  };
  const required = new Set(['component', ...(json.required ?? [])]);

  // A2UI では入力欄の値はデータモデルに置く。束縛されていない値の setter は
  // 何もしないので、値を必須にして必ず `@path` で結ばせる
  if (entry.value !== undefined) {
    const { prop } = entry.value;
    const field = json.properties?.[prop];
    properties[prop] = {
      $ref: `${COMMON_TYPES}/${dynamicTypeOf(field)}`,
      description: `${field?.description ?? 'The value of the field.'} Bind it to the data model with {"@path": "/..."}; the input writes what the user enters there.`,
    };
    required.add(prop);
  }
  if (entry.children === true) {
    properties.children = {
      $ref: `${COMMON_TYPES}/ChildList`,
      description: 'The ids of the components inside, in order.',
    };
    required.add('children');
  }
  for (const [event, description] of Object.entries(entry.events ?? {})) {
    properties[event] = {
      $ref: `${COMMON_TYPES}/Action`,
      description: `${description} To report it to the assistant, set it to {"event": {"name": "...", "context": {...}}}.`,
    };
  }

  return {
    type: 'object',
    description: entry.description,
    properties,
    required: [...required],
  };
};

/**
 * The A2UI 1.0 catalog document of `@k8ordo/ui`, built from
 * `@k8ordo/ui/catalog`. Send it to the agent (in the system prompt, or as an
 * inline catalog); the renderer builds its catalog from the same document.
 * Server-safe.
 */
export const catalogDocument = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: CATALOG_ID,
  catalogId: CATALOG_ID,
  protocolVersion: '1.0',
  title: '@k8ordo/ui',
  description: 'The components of @k8ordo/ui, a React design system.',
  instructions: [
    'Build the surface from these components only. Lay them out with Stack and Grid.',
    'Bind the value of every field to the data model with {"@path": "/..."}, and give the values it starts from with updateDataModel.',
    'A component that the user acts on has a property per event (press). Leave it out when nothing should happen; set it to an event to report what the user did, with context values read from the data model by {"@path": "/..."}.',
    ...catalogRules,
  ].join('\n'),
  components: Object.fromEntries(
    catalogNames.map((name) => [name, componentOf(name)]),
  ),
  functions: {},
  $defs: {
    anyComponent: {
      oneOf: catalogNames.map((name) => ({ $ref: `#/components/${name}` })),
    },
  },
};
