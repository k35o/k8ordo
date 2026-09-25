import { defineRoutes } from '@k8ordo/router';
import type { Match } from '@k8ordo/router';
import type { FC, ReactElement, ReactNode } from 'react';

import { buildTable } from '../generate/emit';
import { parseRouteTree } from '../grammar/tree';
import { renderMatch, renderNotFound } from './render';

type Rendered = ReactElement<{
  readonly params: Readonly<Record<string, unknown>>;
  readonly children?: ReactNode;
}>;

const nothing: FC = () => null;
const components = new Map<string, FC>();
// 同一性で stack を検証するので、ファイルごとに別のラッパーを作る
const component = (file: string): FC => {
  const existing = components.get(file);
  if (existing !== undefined) return existing;
  const made: FC = nothing.bind(null);
  components.set(file, made);
  return made;
};

const { tree } = parseRouteTree(['layout.tsx', 'products/[id]/page.tsx']);
const routes = defineRoutes(buildTable(tree, component));

describe('renderMatch', () => {
  it('hands the page the parsed params and the layouts above it the strings', () => {
    const match = routes.match('/products/7');
    expect(match).not.toBeNull();

    const rendered = renderMatch(match as Match, '/products/7', {
      id: 7,
    }) as Rendered;

    expect(rendered.type).toBe(component('layout.tsx'));
    expect(rendered.props.params).toStrictEqual({ id: '7' });
    const page = rendered.props.children as Rendered;
    expect(page.type).toBe(component('products/[id]/page.tsx'));
    expect(page.props.params).toStrictEqual({ id: 7 });
  });
});

describe('renderNotFound', () => {
  it('answers inside the root layout, so the document keeps its frame', () => {
    const rendered = renderNotFound(routes, '/nowhere') as Rendered;

    expect(rendered.type).toBe(component('layout.tsx'));
    expect(rendered.props.params).toStrictEqual({});
    expect(rendered.props.children).toBeDefined();
  });

  it('writes a document of its own when there is no root layout', () => {
    const bare = defineRoutes(
      buildTable(parseRouteTree(['page.tsx']).tree, component),
    );
    const rendered = renderNotFound(bare, '/nowhere') as Rendered;

    expect(rendered.type).toBe('html');
  });
});
