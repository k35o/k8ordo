import { catalog } from '@k8ordo/ui/catalog';
import type { CatalogName } from '@k8ordo/ui/catalog';
import { createLibrary, defineComponent } from '@openuidev/lang-core';
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
 * A component with children takes them as `children`, the last positional
 * argument, typed as a list of any component of the library.
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
    const { props, children: hasChildren } = catalog[name] as {
      props: z.ZodObject;
      children?: true;
    };
    defined.push(
      defineComponent({
        name,
        description: describe(name),
        props:
          hasChildren === true
            ? props.extend({
                get children() {
                  return children().describe(`Children of the ${name}`);
                },
              })
            : props,
        component: render[name] as C,
      }),
    );
  }

  return createLibrary({ components: defined, root: 'Stack' });
};
