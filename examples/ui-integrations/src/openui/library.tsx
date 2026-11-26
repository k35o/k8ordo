'use client';

import { catalog } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { renderers } from '@k8ordo/ui/catalog/render';
import { useStateField } from '@openuidev/react-lang';
import type { ComponentRenderer } from '@openuidev/react-lang';
import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { buildLibrary } from './defs';

// 部品ごとの型は catalog が持つので、ここでは名前で引いた 1 つの形として扱う
type AnyRenderer = (args: {
  props: Record<string, unknown>;
  children: readonly ReactNode[];
  value?: unknown;
  setValue?: (next: unknown) => void;
}) => ReactNode;
type AnyValue = { initial: (props: unknown) => unknown };
type OpenUIProps = Record<string, unknown> & {
  name?: string;
  children?: ReadonlyArray<{ typeName: string }>;
};

const componentOf = (name: CatalogName): ComponentRenderer<OpenUIProps> => {
  const render = renderers[name] as AnyRenderer;
  const { value } = catalog[name] as { value?: AnyValue };
  const draw = (
    { children = [], ...props }: OpenUIProps,
    renderNode: (node: unknown) => ReactNode,
    field?: { value: unknown; setValue: (next: unknown) => void },
  ): ReactNode =>
    render({
      props,
      children: children.map((child, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- 位置で決まる静的な子の並び
        <Fragment key={`${child.typeName}-${index}`}>
          {renderNode(child)}
        </Fragment>
      )),
      ...field,
    });

  if (value === undefined) {
    return ({ props, renderNode }) => draw(props, renderNode);
  }
  const Field: ComponentRenderer<OpenUIProps> = ({ props, renderNode }) => {
    const field = useStateField(props.name ?? '', value.initial(props));
    return draw(props, renderNode, field);
  };
  return Field;
};

/**
 * The OpenUI library of `@k8ordo/ui`: pass it to `<Renderer library={library} />`.
 * For the system prompt alone, without React, use `./prompt`.
 */
export const library = buildLibrary<ComponentRenderer<OpenUIProps>>(
  Object.fromEntries(
    Object.keys(catalog).map((name) => [
      name,
      componentOf(name as CatalogName),
    ]),
  ),
);
