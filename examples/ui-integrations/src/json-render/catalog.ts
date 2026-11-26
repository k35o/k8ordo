import {
  autoFixSpec,
  defineCatalog,
  isNonEmptySpec,
  validateSpec,
} from '@json-render/core';
import type { Spec, UIElement } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { catalog as k8ordo, catalogPropIssues } from '@k8ordo/ui/catalog';
import type {
  CatalogEntry,
  CatalogName,
  CatalogProps,
} from '@k8ordo/ui/catalog';

type JsonRenderComponent<N extends CatalogName> = {
  props: (typeof k8ordo)[N]['props'];
  description: string;
  slots?: string[];
};

// json-render は値を `$bindState` で状態に結ぶ。どの prop が結べるかは
// モデルが説明文から読むので、ここで書き足す
const describe = (
  entry: Pick<CatalogEntry, 'description'> & { value?: { prop: string } },
): string =>
  entry.value === undefined
    ? entry.description
    : `${entry.description} ${entry.value.prop} can be bound to state with $bindState.`;

const components = Object.fromEntries(
  Object.entries(k8ordo).map(([name, entry]) => [
    name,
    {
      props: entry.props,
      description: describe(entry),
      ...(entry.children === true ? { slots: ['default'] } : {}),
    },
  ]),
) as { [N in CatalogName]: JsonRenderComponent<N> };

/** The json-render catalog of `@k8ordo/ui`: schemas and the system prompt. Server-safe. */
export const catalog = defineCatalog(schema, { components, actions: {} });

/** One element of a spec built only from `@k8ordo/ui` components. */
export type UISpecElement = {
  [N in CatalogName]: Omit<UIElement, 'type' | 'props'> & {
    type: N;
    props: CatalogProps<N>;
  };
}[CatalogName];

/** A spec built only from `@k8ordo/ui` components; `satisfies UISpec` type-checks it. */
export type UISpec = {
  root: string;
  elements: Record<string, UISpecElement>;
  state?: Spec['state'];
};

export type GeneratedSpecIssue = {
  /** The element the issue is in (none for an issue with the whole spec). */
  elementKey?: string;
  message: string;
};

export type ValidateGeneratedSpecResult =
  | { ok: true; spec: UISpec; fixes: string[] }
  | { ok: false; issues: GeneratedSpecIssue[]; repairPrompt: string };

const buildRepairPrompt = (issues: GeneratedSpecIssue[]): string =>
  [
    'The generated UI spec is invalid. Fix the following issues and return the corrected spec:',
    ...issues.map((issue) =>
      issue.elementKey === undefined
        ? `- ${issue.message}`
        : `- [${issue.elementKey}] ${issue.message}`,
    ),
  ].join('\n');

/**
 * Validates a spec a model wrote: json-render's mechanical fixes and
 * structural checks, then `@k8ordo/ui`'s own check of every element's props.
 * A broken spec comes back with a repair prompt to send to the model.
 *
 * `catalog.validate()` is not used: it rejects valid specs in the current
 * json-render, and lets unknown props through.
 */
export const validateGeneratedSpec = (
  input: unknown,
): ValidateGeneratedSpecResult => {
  if (!isNonEmptySpec(input)) {
    const issues: GeneratedSpecIssue[] = [
      {
        message:
          'The spec must be an object with a `root` key and an `elements` map.',
      },
    ];
    return { ok: false, issues, repairPrompt: buildRepairPrompt(issues) };
  }

  const { spec, fixes } = autoFixSpec(input);
  const issues: GeneratedSpecIssue[] = [
    ...validateSpec(spec).issues.map((issue) => ({
      elementKey: issue.elementKey,
      message: issue.message,
    })),
    ...Object.entries(spec.elements).flatMap(([elementKey, element]) =>
      catalogPropIssues(element.type, element.props).map((message) => ({
        elementKey,
        message,
      })),
    ),
  ];

  if (issues.length === 0) {
    return { ok: true, spec: spec as UISpec, fixes };
  }
  return { ok: false, issues, repairPrompt: buildRepairPrompt(issues) };
};
