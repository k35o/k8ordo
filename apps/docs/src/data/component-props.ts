import generated from '@k8ordo/ui/props.json';

import type { PropItem } from '../components/props-table';

type GeneratedProp = {
  name: string;
  types: string[];
  defaultValue: string | null;
  required: boolean;
};

const byName = new Map(
  generated.components.map((component) => [component.name, component]),
);

/**
 * Props of a component, extracted from its types by
 * `packages/ui/scripts/extract-props.ts`.
 *
 * Throws on an unknown name so a renamed or removed component fails the docs
 * build instead of silently rendering an empty table.
 */
export const propsOf = (name: string): readonly PropItem[] => {
  const component = byName.get(name);
  if (!component) {
    throw new Error(
      `No generated props for "${name}". Run \`pnpm --filter @k8ordo/ui generate:props\`.`,
    );
  }
  return component.props.map((prop: GeneratedProp) => ({
    name: prop.required ? prop.name : `${prop.name}?`,
    types: prop.types,
    defaultValue: prop.defaultValue,
  }));
};

/** Base type the component forwards its remaining props to, if any. */
export const inheritsOf = (name: string): string | undefined =>
  byName.get(name)?.inherits ?? undefined;
