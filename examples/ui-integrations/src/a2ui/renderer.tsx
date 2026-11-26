'use client';

import { A2uiSurface, createComponentImplementation } from '@a2ui/react';
import type { ReactA2uiComponentProps } from '@a2ui/react';
import { Catalog } from '@a2ui/web_core';
import type {
  ComponentApi,
  MessageProcessor,
  SurfaceModel,
} from '@a2ui/web_core';
import { catalog as k8ordo } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { renderers } from '@k8ordo/ui/catalog/render';
import { Fragment, useCallback, useSyncExternalStore } from 'react';
import type { ComponentProps, FC, ReactNode } from 'react';

import { catalogDocument } from './catalog';

// 部品ごとの型は catalog が持つので、ここでは名前で引いた 1 つの形として扱う
type AnyRenderer = (args: {
  props: Record<string, unknown>;
  children: readonly ReactNode[];
  value?: unknown;
  setValue?: (next: unknown) => void;
}) => ReactNode;
type Entry = {
  props: { shape: Record<string, unknown> };
  children?: true;
  value?: { prop: string; initial: (props: unknown) => unknown };
};
type ChildRef = string | { id: string; basePath: string };
type View = FC<ReactA2uiComponentProps<Record<string, unknown>>>;
type Implementation = ReturnType<typeof createComponentImplementation>;
type ReactSurface = ComponentProps<typeof A2uiSurface>['surface'];

// @a2ui/react は型を peer の zod で書いており、アプリの zod 4 に解決されると
// @a2ui/web_core の zod 3 の型と合わない。実行時の @a2ui/react は zod を
// 読まないので、web_core と受け渡す 2 か所でだけ型を合わせる
const toWebCore = (implementations: Implementation[]): ComponentApi[] =>
  implementations as unknown as ComponentApi[];
const toReactSurface = (surface: SurfaceModel): ReactSurface =>
  surface as unknown as ReactSurface;

const setterOf = (prop: string): string =>
  `set${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;

const viewOf = (name: CatalogName): View => {
  const render = renderers[name] as AnyRenderer;
  const entry = k8ordo[name] as Entry;
  const keys = Object.keys(entry.props.shape);

  const View: View = ({ props, buildChild }) => {
    const own = Object.fromEntries(
      keys.filter((key) => key in props).map((key) => [key, props[key]]),
    );
    const children =
      entry.children === true
        ? ((props.children ?? []) as ChildRef[]).map((child) =>
            typeof child === 'string' ? (
              <Fragment key={child}>{buildChild(child)}</Fragment>
            ) : (
              <Fragment key={`${child.id}@${child.basePath}`}>
                {buildChild(child.id, child.basePath)}
              </Fragment>
            ),
          )
        : [];
    if (entry.value === undefined) {
      return render({ props: own, children });
    }
    const { prop, initial } = entry.value;
    return render({
      props: own,
      children,
      value: own[prop] ?? initial(own),
      setValue: props[setterOf(prop)] as (next: unknown) => void,
    });
  };
  return View;
};

const schemas = Catalog.fromJson(catalogDocument);

/**
 * The A2UI catalog of `@k8ordo/ui` for `MessageProcessor`: the catalog
 * document's schemas, each drawn with `@k8ordo/ui` through the generic binder.
 */
export const a2uiCatalog = schemas.withEntries(
  toWebCore(
    [...schemas.components.values()].map((api) =>
      createComponentImplementation(api, viewOf(api.name as CatalogName)),
    ),
  ),
  [],
);

/** Draws every surface the processor holds, as the agent creates and deletes them. */
export const A2uiSurfaces: FC<{ processor: MessageProcessor }> = ({
  processor,
}) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const created = processor.onSurfaceCreated(onChange);
      const deleted = processor.onSurfaceDeleted(onChange);
      return () => {
        created.unsubscribe();
        deleted.unsubscribe();
      };
    },
    [processor],
  );
  const surfaces = useSyncExternalStore(subscribe, () => surfacesOf(processor));
  return surfaces.map((surface) => (
    <A2uiSurface
      key={`${String(idOf(processor))}:${surface.id}`}
      surface={toReactSurface(surface)}
    />
  ));
};

// 生成し直すと別の processor が同じ surface の id を使う。A2uiSurface は最初に
// 渡された surface に結び付くので、processor が変わったら作り直させる
const ids = new WeakMap<MessageProcessor, number>();
let nextId = 0;
const idOf = (processor: MessageProcessor): number => {
  const known = ids.get(processor);
  if (known !== undefined) {
    return known;
  }
  nextId += 1;
  ids.set(processor, nextId);
  return nextId;
};

// useSyncExternalStore は同じ状態に同じ参照を返す必要があるので、surface の
// 組み合わせが変わったときだけ配列を作り直す
const cache = new WeakMap<MessageProcessor, SurfaceModel[]>();
const surfacesOf = (processor: MessageProcessor): SurfaceModel[] => {
  const current = [...processor.model.surfacesMap.values()];
  const cached = cache.get(processor);
  if (
    cached?.length === current.length &&
    cached.every((surface, index) => surface === current[index])
  ) {
    return cached;
  }
  cache.set(processor, current);
  return current;
};
