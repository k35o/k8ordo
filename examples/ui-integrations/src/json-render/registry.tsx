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

import { componentsCatalog, TO_ASSISTANT } from './catalog';

// 部品ごとの型は catalog が持つので、ここでは名前で引いた 1 つの形として扱う
type Handler = () => void;
type AnyRenderer = (args: {
  props: Record<string, unknown>;
  children: readonly ReactNode[];
  value?: unknown;
  setValue?: (next: unknown) => void;
  on?: Record<string, Handler>;
}) => ReactNode;
type AnyValue = { prop: string; initial: (props: unknown) => unknown };
type ComponentFn = (context: BaseComponentProps) => ReactNode;

const childrenOf = (children: ReactNode): ReactNode[] =>
  // oxlint-disable-next-line react/no-react-children -- json-render は子を 1 つの ReactNode で渡すので、1 つずつに分けて key を付ける
  Children.toArray(children);

const handlersOf = (
  events: readonly string[],
  on: BaseComponentProps['on'],
): Record<string, Handler> =>
  Object.fromEntries(
    events.flatMap((event) => {
      const handle = on(event);
      return handle.bound ? [[event, handle.emit]] : [];
    }),
  );

const componentOf = (name: CatalogName): ComponentFn => {
  const render = renderers[name] as AnyRenderer;
  const { value, events = {} } = k8ordo[name] as {
    value?: AnyValue;
    events?: Readonly<Record<string, string>>;
  };
  const eventNames = Object.keys(events);
  if (value === undefined) {
    return ({ props, children, on }) =>
      render({
        props,
        children: childrenOf(children),
        on: handlersOf(eventNames, on),
      });
  }
  const Field: ComponentFn = ({ props, children, bindings, on }) => {
    const path = bindings?.[value.prop];
    const isBound = path !== undefined && path !== '';
    const [bound, setBound] = useBoundProp<unknown>(props[value.prop], path);
    const [local, setLocal] = useState(() => value.initial(props));
    return render({
      props,
      children: childrenOf(children),
      value: isBound ? (bound ?? value.initial(props)) : local,
      setValue: isBound ? setBound : setLocal,
      on: handlersOf(eventNames, on),
    });
  };
  return Field;
};

/** The json-render registry that draws every component of the catalog with `@k8ordo/ui`. */
export const { registry } = defineRegistry(componentsCatalog, {
  components: Object.fromEntries(
    Object.keys(k8ordo).map((name) => [name, componentOf(name as CatalogName)]),
  ) as Record<CatalogName, ComponentFn>,
});

type StateChanges = Array<{ path: string; value: unknown }>;
type ToAssistant = (params: Record<string, unknown>) => void | Promise<void>;

/**
 * `JSONUIProvider` wired to the registry, starting from the spec's `state`.
 * Put `Renderer` inside it, and anything that reads the state with
 * `useStateStore`. While a spec streams in, a value the spec changes replaces
 * the one in the state; the others keep what the user entered.
 * `onToAssistant` receives the params of every `toAssistant` action the user
 * sets off; json-render's own actions (`setState`, …) run without it.
 */
export const JsonRenderProvider: FC<{
  spec: Spec | null;
  onStateChange?: (changes: StateChanges) => void;
  onToAssistant?: ToAssistant;
  children: ReactNode;
}> = ({ spec, onStateChange, onToAssistant, children }) => (
  <JSONUIProvider
    handlers={
      onToAssistant === undefined
        ? undefined
        : { [TO_ASSISTANT]: onToAssistant }
    }
    initialState={spec?.state ?? undefined}
    onStateChange={onStateChange}
    registry={registry}
  >
    {children}
  </JSONUIProvider>
);

/**
 * Draws a spec with `@k8ordo/ui`: `JsonRenderProvider` and `Renderer` wired to
 * the registry. Pass `onStateChange` to collect the form values, and
 * `onToAssistant` to hear what the user did.
 */
export const JsonRenderUI: FC<{
  spec: Spec | null;
  loading?: boolean;
  onStateChange?: (changes: StateChanges) => void;
  onToAssistant?: ToAssistant;
}> = ({ spec, loading, onStateChange, onToAssistant }) => (
  <JsonRenderProvider
    onStateChange={onStateChange}
    onToAssistant={onToAssistant}
    spec={spec}
  >
    <Renderer loading={loading} registry={registry} spec={spec} />
  </JsonRenderProvider>
);
