import { catalog, catalogPropIssues } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { createContext, useContext, useEffect, useId } from 'react';
import type { FC } from 'react';
import type { z } from 'zod';

/** The props a renderer takes, or why what the model wrote cannot be drawn. */
export type ParsedProps =
  | { success: true; props: Record<string, unknown> }
  | { success: false; issues: readonly string[] };

/**
 * Drops every `null` key, nested ones included, and keeps list items as they
 * are. A format writes `null` for a prop it leaves out (OpenUI Lang for an
 * omitted positional argument, json-render for a state path that holds
 * nothing), and a schema's optional prop takes no `null`, so a glue drops
 * them before it checks or draws.
 */
export const withoutNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(withoutNulls);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) =>
        entry === null ? [] : [[key, withoutNulls(entry)]],
      ),
    );
  }
  return value;
};

/**
 * Turns the props a format resolved for one component into the props its
 * renderer takes: drops every `null` key, nested ones included, then parses
 * the rest with the entry's `props` schema. A format validates with JSON
 * Schema, which leaves zod's own checks out, or with less (OpenUI does not
 * check `pattern`), so what it lets through may still not fit.
 *
 * `bound` names a prop the format's state fills (a field's value bound to
 * state). It is left out of the parse: what the user entered is not what the
 * model wrote, and the renderer takes it as `value`.
 */
export const parseCatalogProps = (
  name: CatalogName,
  props: Readonly<Record<string, unknown>>,
  bound?: string,
): ParsedProps => {
  const schema: z.ZodObject = catalog[name].props;
  const own = withoutNulls(
    Object.fromEntries(Object.entries(props).filter(([key]) => key !== bound)),
  );
  const parsed = schema.safeParse(own);
  return parsed.success
    ? { success: true, props: parsed.data }
    : {
        success: false,
        issues: catalogPropIssues(name, own, {
          unresolved: bound === undefined ? [] : [bound],
        }),
      };
};

/** Hears an element a glue draws nothing for: its issues, or `null` once it is gone. */
export type UnparsedListener = (
  key: string,
  issues: readonly string[] | null,
) => void;

/**
 * Where `Unparsed` reports. Provide it around a format's renderer to show
 * which elements were left out, and why, as the playground does.
 */
export const UnparsedContext = createContext<UnparsedListener | null>(null);

/**
 * What a glue draws for an element whose props do not parse: nothing. The
 * issues go to `UnparsedContext`, if one is provided. While a spec streams in,
 * the element is drawn once its props parse.
 */
export const Unparsed: FC<{ issues: readonly string[] }> = ({ issues }) => {
  const listen = useContext(UnparsedContext);
  const key = useId();
  // issues は描くたびに作り直されるので、同じ中身を 2 度伝えても聞き手が無視する
  useEffect(() => {
    listen?.(key, issues);
  }, [listen, key, issues]);
  useEffect(
    () => () => {
      listen?.(key, null);
    },
    [listen, key],
  );
  return null;
};
