import { catalog } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { action, createLibrary, defineComponent } from '@openuidev/lang-core';
import type { DefinedComponent, Library } from '@openuidev/lang-core';
import { z } from 'zod';

// OpenUI は値を `name` で form の状態に結ぶ。モデルは説明文からそれを読むので、
// 値を持つ部品にだけ書き足す
const describe = (name: CatalogName): string => {
  const { description, value } = catalog[name] as {
    description: string;
    value?: unknown;
  };
  return value === undefined
    ? description
    : `${description} Bound to form state by name.`;
};

const NAMES = Object.keys(catalog) as CatalogName[];

/**
 * Builds the OpenUI library of `@k8ordo/ui` from the catalog, with the
 * renderers given (none, for a library that only writes the prompt).
 *
 * A component with children takes them as `children`, after its props, typed
 * as a list of any component of the library. Each of its `events` follows as
 * an action argument, last, so a program written before a component had the
 * event still reads the same.
 */
export const buildLibrary = <C>(
  render: Partial<Record<CatalogName, C>>,
): Library<C> => {
  type Ref = DefinedComponent<z.ZodObject, C>['ref'];
  const defined: Array<DefinedComponent<z.ZodObject, C>> = [];

  // 入れ物は互いを子に持つので、まだ定義していない部品も参照できるよう getter で遅らせる
  const children = () =>
    z.array(
      z.union(defined.map((component) => component.ref) as [Ref, ...Ref[]]),
    );

  for (const name of NAMES) {
    const {
      props,
      children: hasChildren,
      events = {},
    } = catalog[name] as {
      props: z.ZodObject;
      children?: true;
      events?: Readonly<Record<string, string>>;
    };
    const actions = Object.fromEntries(
      Object.entries(events).map(([event, description]) => [
        event,
        action().optional().describe(description),
      ]),
    );
    defined.push(
      defineComponent({
        name,
        description: describe(name),
        // children の getter を評価させないよう、子と操作を 1 回の extend で足す
        props:
          hasChildren === true
            ? props.extend({
                get children() {
                  return children().describe(`Children of the ${name}`);
                },
                ...actions,
              })
            : props.extend(actions),
        component: render[name] as C,
      }),
    );
  }

  return createLibrary({ components: defined, root: 'Stack' });
};
