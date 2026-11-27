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
import type { AnyCatalogEntry, CatalogName } from '@k8ordo/ui/catalog';
import { rendererOf } from '@k8ordo/ui/catalog/render';
import { Children, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { parseCatalogProps, Unparsed } from '../catalog-props';
import { componentsCatalog, TO_ASSISTANT } from './catalog';

type Handler = () => void;
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
  const render = rendererOf(name);
  const { value, events = {} }: AnyCatalogEntry = k8ordo[name];
  const eventNames = Object.keys(events);
  if (value === undefined) {
    const Element: ComponentFn = ({ props, children, on }) => {
      const parsed = parseCatalogProps(name, props);
      return parsed.success ? (
        render({
          props: parsed.props,
          children: childrenOf(children),
          on: handlersOf(eventNames, on),
        })
      ) : (
        <Unparsed issues={parsed.issues} />
      );
    };
    return Element;
  }
  const Field: FC<{
    own: Record<string, unknown>;
    path: string | undefined;
    written: unknown;
    children: ReactNode;
    on: BaseComponentProps['on'];
  }> = ({ own, path, written, children, on }) => {
    const [bound, setBound] = useBoundProp<unknown>(written, path);
    const [local, setLocal] = useState(() => value.initial(own));
    return render({
      props: own,
      children: childrenOf(children),
      value: path === undefined ? local : (bound ?? value.initial(own)),
      setValue: path === undefined ? setLocal : setBound,
      on: handlersOf(eventNames, on),
    });
  };
  const FieldElement: ComponentFn = ({ props, children, bindings, on }) => {
    const binding = bindings?.[value.prop];
    const path = binding === '' ? undefined : binding;
    const parsed = parseCatalogProps(
      name,
      props,
      path === undefined ? undefined : value.prop,
    );
    return parsed.success ? (
      <Field on={on} own={parsed.props} path={path} written={props[value.prop]}>
        {children}
      </Field>
    ) : (
      <Unparsed issues={parsed.issues} />
    );
  };
  return FieldElement;
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
}> = ({ spec, onStateChange, onToAssistant, children }) => {
  // json-render の ActionProvider は最初に渡された handlers を握ったまま
  // 差し替えを読まない。最新の onToAssistant を呼ぶ handler を 1 つだけ渡す
  const latest = useRef(onToAssistant);
  useEffect(() => {
    latest.current = onToAssistant;
  });
  const handlers = useMemo(
    () => ({
      [TO_ASSISTANT]: async (params: Record<string, unknown>) => {
        await latest.current?.(params);
      },
    }),
    [],
  );
  return (
    <JSONUIProvider
      handlers={handlers}
      initialState={spec?.state ?? undefined}
      onStateChange={onStateChange}
      registry={registry}
    >
      {children}
    </JSONUIProvider>
  );
};

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
