'use client';

import type { Spec } from '@json-render/core';
import {
  defineRegistry,
  JSONUIProvider,
  Renderer,
  useBoundProp,
} from '@json-render/react';
import type { BaseComponentProps } from '@json-render/react';
import { catalog as k8ordo } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { renderers } from '@k8ordo/ui/catalog/render';
import { Children, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { catalog } from './catalog';

// 部品ごとの型は catalog が持つので、ここでは名前で引いた 1 つの形として扱う
type AnyRenderer = (args: {
  props: Record<string, unknown>;
  children: readonly ReactNode[];
  value?: unknown;
  setValue?: (next: unknown) => void;
}) => ReactNode;
type AnyValue = { prop: string; initial: (props: unknown) => unknown };
type ComponentFn = (context: BaseComponentProps) => ReactNode;

const childrenOf = (children: ReactNode): ReactNode[] =>
  // oxlint-disable-next-line react/no-react-children -- json-render は子を 1 つの ReactNode で渡すので、1 つずつに分けて key を付ける
  Children.toArray(children);

const componentOf = (name: CatalogName): ComponentFn => {
  const render = renderers[name] as AnyRenderer;
  const { value } = k8ordo[name] as { value?: AnyValue };
  if (value === undefined) {
    return ({ props, children }) =>
      render({ props, children: childrenOf(children) });
  }
  const Field: ComponentFn = ({ props, children, bindings }) => {
    const path = bindings?.[value.prop];
    const isBound = path !== undefined && path !== '';
    const [bound, setBound] = useBoundProp<unknown>(props[value.prop], path);
    const [local, setLocal] = useState(() => value.initial(props));
    return render({
      props,
      children: childrenOf(children),
      value: isBound ? (bound ?? value.initial(props)) : local,
      setValue: isBound ? setBound : setLocal,
    });
  };
  return Field;
};

/** The json-render registry that draws every component of the catalog with `@k8ordo/ui`. */
export const { registry } = defineRegistry(catalog, {
  components: Object.fromEntries(
    Object.keys(k8ordo).map((name) => [name, componentOf(name as CatalogName)]),
  ) as Record<CatalogName, ComponentFn>,
});

/**
 * Draws a spec with `@k8ordo/ui`: `JSONUIProvider` and `Renderer` wired to the
 * registry. Pass `onStateChange` to collect the form values.
 */
export const JsonRenderUI: FC<{
  spec: Spec | null;
  loading?: boolean;
  onStateChange?: (changes: Array<{ path: string; value: unknown }>) => void;
}> = ({ spec, loading, onStateChange }) => (
  <JSONUIProvider onStateChange={onStateChange} registry={registry}>
    <Renderer loading={loading} registry={registry} spec={spec} />
  </JSONUIProvider>
);
