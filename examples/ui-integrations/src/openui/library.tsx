'use client';

import { catalog, catalogNames } from '@k8ordo/ui/catalog';
import type { AnyCatalogEntry, CatalogName } from '@k8ordo/ui/catalog';
import { rendererOf } from '@k8ordo/ui/catalog/render';
import {
  useFormName,
  useStateField,
  useTriggerAction,
} from '@openuidev/react-lang';
import type { ActionPlan, ComponentRenderer } from '@openuidev/react-lang';
import { Fragment } from 'react';
import type { FC, ReactNode } from 'react';

import { parseCatalogProps, Unparsed } from '../catalog-props';
import { buildLibrary } from './defs';

type Handler = () => void | Promise<void>;
type Field = { value: unknown; setValue: (next: unknown) => void };
type OpenUIProps = Record<string, unknown> & {
  name?: string;
  children?: ReadonlyArray<{ typeName: string }>;
};

const noField = (): Field | undefined => undefined;
const noHandlers = (): Record<string, Handler> => ({});

const componentOf = (name: CatalogName): ComponentRenderer<OpenUIProps> => {
  const render = rendererOf(name);
  const { value, events = {} }: AnyCatalogEntry = catalog[name];
  const eventNames = Object.keys(events);

  const useField =
    value === undefined
      ? noField
      : (props: OpenUIProps): Field =>
          useStateField(props.name ?? '', value.initial(props));

  const useHandlers =
    eventNames.length === 0
      ? noHandlers
      : (props: OpenUIProps): Record<string, Handler> => {
          const trigger = useTriggerAction();
          const formName = useFormName();
          const label = typeof props.label === 'string' ? props.label : null;
          return Object.fromEntries(
            eventNames.flatMap((event) => {
              const plan = (props[event] ?? undefined) as
                | ActionPlan
                | undefined;
              // OpenUI のプロンプトは、action の無いボタンはラベルを送ると教える。
              // ラベルの無い部品（Card）は、action が無ければ押せないままにする
              if (plan === undefined && label === null) {
                return [];
              }
              const handler: Handler = () =>
                trigger(label ?? '', formName, plan);
              return [[event, handler]];
            }),
          );
        };

  const Drawn: FC<{
    own: OpenUIProps;
    written: OpenUIProps;
    children: readonly ReactNode[];
  }> = ({ own, written, children }) => {
    const field = useField(own);
    const on = useHandlers(written);
    return render({ props: own, children, ...field, on });
  };

  const Component: ComponentRenderer<OpenUIProps> = ({ props, renderNode }) => {
    const { children = [], ...rest } = props;
    const parsed = parseCatalogProps(
      name,
      Object.fromEntries(
        Object.entries(rest).filter(([key]) => !eventNames.includes(key)),
      ),
    );
    if (!parsed.success) {
      return <Unparsed issues={parsed.issues} />;
    }
    return (
      <Drawn own={parsed.props} written={props}>
        {children.map((child, index) => (
          // oxlint-disable-next-line react/no-array-index-key -- 位置で決まる静的な子の並び
          <Fragment key={`${child.typeName}-${index}`}>
            {renderNode(child)}
          </Fragment>
        ))}
      </Drawn>
    );
  };
  return Component;
};

/**
 * The OpenUI library of `@k8ordo/ui`: pass it to `<Renderer library={library} />`.
 * For the system prompt alone, without React, use `./prompt`.
 */
export const library = buildLibrary<ComponentRenderer<OpenUIProps>>(
  Object.fromEntries(catalogNames.map((name) => [name, componentOf(name)])),
);
