import type { Message } from '@k8ordo/i18n';

import * as m from '../../messages';
import { DocSection, DocSubsection } from '../doc-page';
import { Rich } from '../rich';
import type { Mode } from './mode';

type RouteFile = {
  id: string;
  name: string;
  items: readonly Message[];
};

/** A file name in code font, the same in every locale. */
const named =
  (name: string): Message =>
  () =>
    `\`${name}\``;

const filesOf = (mode: Mode): readonly RouteFile[] => {
  const t = m.frameworkReference;
  const server = m.serverReference;
  const own = mode === 'static' ? m.staticReference : m.serverReference;
  const request = mode === 'server' ? [server.pageRequest] : [];
  return [
    {
      id: 'page-tsx',
      name: 'page.tsx',
      items: [
        t.pageDefault,
        ...request,
        t.pageSchema,
        ...(mode === 'server' ? [server.pageSearch] : []),
      ],
    },
    {
      id: 'layout-tsx',
      name: 'layout.tsx',
      items: [t.layoutDefault, ...request, t.layoutSchema],
    },
    {
      id: 'not-found-tsx',
      name: 'not-found.tsx',
      items: [t.notFoundDefault, ...request, own.notFoundNote],
    },
    {
      id: 'error-tsx',
      name: 'error.tsx',
      items: [t.errorDirective, t.errorDefault],
    },
    { id: 'loading-tsx', name: 'loading.tsx', items: [t.loadingDefault] },
    {
      id: 'redirect-ts',
      name: 'redirect.ts',
      items: [t.redirectDefault, own.redirectNote],
    },
    {
      id: 'route-ts',
      name: 'route.ts',
      items: [t.routeMethods, t.routeSchema, own.routeNote],
    },
    {
      id: 'guard-ts',
      name: 'guard.ts',
      items: [
        mode === 'static' ? m.staticReference.guardNote : server.guardDefault,
      ],
    },
  ];
};

/**
 * The route files, one subsection each. Functions rather than components, so
 * `DocPage` sees the sections they return and lists them in the contents.
 */
export const filesSection = (mode: Mode) => {
  const t = m.frameworkReference;
  return (
    <DocSection description={t.filesDescription} id="files" title={t.filesTitle}>
      {filesOf(mode).map((file) => (
        <DocSubsection id={file.id} key={file.id} title={named(file.name)}>
          <ul>
            {file.items.map((item) => (
              <li key={item()}>
                <Rich>{item()}</Rich>
              </li>
            ))}
          </ul>
        </DocSubsection>
      ))}
    </DocSection>
  );
};

export const routerSection = () => {
  const t = m.frameworkReference;
  return (
    <DocSection
      description={t.routerDescription}
      id="router"
      title={t.routerTitle}
    >
      <ul>
        {t.routerList.map((item) => (
          <li key={item()}>
            <Rich>{item()}</Rich>
          </li>
        ))}
      </ul>
    </DocSection>
  );
};
