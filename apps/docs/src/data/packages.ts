import type { Message } from '@k8ordo/i18n';

import { STORYBOOK_URL } from '../constants';
import type { SitePath } from '../links';
import * as m from '../messages';

export type PackageSection = { path: SitePath; label: Message };

export type PackageEntry = {
  /** The published name, e.g. `@k8ordo/router`. */
  name: string;
  /** The short name the header shows. */
  label: string;
  path: SitePath;
  /** What the home page says about it. */
  description: Message;
  /** In reading order: the header's second row, the footer column, and the pager all follow it. */
  sections: [PackageSection, ...PackageSection[]];
  /** Links off the site that belong in the package's footer column. */
  external?: Array<{ href: string; label: string }>;
};

/**
 * The site's first level. Every place that lists packages or a package's
 * sections reads this, so adding a page is one line here and nothing else.
 */
export const PACKAGES: PackageEntry[] = [
  {
    name: '@k8ordo/ui',
    label: 'UI',
    path: '/:locale/ui',
    description: m.home.memberUiDescription,
    sections: [
      { path: '/:locale/ui/get-started', label: m.nav.getStarted },
      { path: '/:locale/ui/theming', label: m.nav.theming },
      { path: '/:locale/ui/i18n', label: m.nav.i18n },
      { path: '/:locale/ui/components', label: m.nav.components },
      { path: '/:locale/ui/ai', label: m.nav.ai },
    ],
    external: [{ href: STORYBOOK_URL, label: 'Storybook' }],
  },
  {
    name: '@k8ordo/form',
    label: 'Form',
    path: '/:locale/form',
    description: m.home.memberFormDescription,
    sections: [
      { path: '/:locale/form/get-started', label: m.nav.getStarted },
      { path: '/:locale/form/fields', label: m.form.navFields },
      { path: '/:locale/form/validation', label: m.form.navValidation },
      { path: '/:locale/form/patterns', label: m.form.navPatterns },
    ],
  },
  {
    name: '@k8ordo/state',
    label: 'State',
    path: '/:locale/state',
    description: m.home.memberStateDescription,
    sections: [
      { path: '/:locale/state/get-started', label: m.nav.getStarted },
      { path: '/:locale/state/places', label: m.state.navPlaces },
      { path: '/:locale/state/reading', label: m.state.navReading },
      { path: '/:locale/state/updates', label: m.state.navUpdates },
      { path: '/:locale/state/integrations', label: m.state.navIntegrations },
    ],
  },
  {
    name: '@k8ordo/router',
    label: 'Router',
    path: '/:locale/router',
    description: m.router.description,
    sections: [
      { path: '/:locale/router/get-started', label: m.nav.getStarted },
      { path: '/:locale/router/routes', label: m.router.navRoutes },
      { path: '/:locale/router/links', label: m.router.navLinks },
      { path: '/:locale/router/navigation', label: m.router.navNavigation },
      { path: '/:locale/router/framework', label: m.router.navFramework },
    ],
  },
  {
    name: '@k8ordo/static',
    label: 'Static',
    path: '/:locale/static',
    description: m.static.description,
    sections: [
      { path: '/:locale/static/get-started', label: m.nav.getStarted },
      { path: '/:locale/static/routing', label: m.static.navRouting },
      { path: '/:locale/static/params', label: m.static.navParams },
      { path: '/:locale/static/errors', label: m.static.navErrors },
      { path: '/:locale/static/boundaries', label: m.static.navBoundaries },
      { path: '/:locale/static/deploy', label: m.static.navDeploy },
    ],
  },
  {
    name: '@k8ordo/server',
    label: 'Server',
    path: '/:locale/server',
    description: m.server.description,
    sections: [
      { path: '/:locale/server/get-started', label: m.nav.getStarted },
      { path: '/:locale/server/routing', label: m.server.navRouting },
      { path: '/:locale/server/params', label: m.server.navParams },
      { path: '/:locale/server/errors', label: m.server.navErrors },
      { path: '/:locale/server/boundaries', label: m.server.navBoundaries },
      { path: '/:locale/server/actions', label: m.server.navActions },
      { path: '/:locale/server/guards', label: m.server.navGuards },
      { path: '/:locale/server/deploy', label: m.server.navDeploy },
    ],
  },
  {
    name: '@k8ordo/i18n',
    label: 'i18n',
    path: '/:locale/i18n',
    description: m.i18n.description,
    sections: [
      { path: '/:locale/i18n/get-started', label: m.nav.getStarted },
      { path: '/:locale/i18n/locales', label: m.i18n.navLocales },
      { path: '/:locale/i18n/messages', label: m.i18n.navMessages },
      { path: '/:locale/i18n/formatting', label: m.i18n.navFormatting },
      { path: '/:locale/i18n/routing', label: m.i18n.navRouting },
      { path: '/:locale/i18n/integrations', label: m.i18n.navIntegrations },
    ],
  },
  {
    name: '@k8ordo/color-scheme',
    label: 'Color scheme',
    path: '/:locale/color-scheme',
    description: m.colorScheme.description,
    sections: [
      { path: '/:locale/color-scheme/get-started', label: m.nav.getStarted },
      {
        path: '/:locale/color-scheme/how-it-works',
        label: m.colorScheme.navHowItWorks,
      },
    ],
  },
];

/**
 * Where a section page sits: its package, itself, and its neighbours in
 * reading order. The first section's previous page is the package's landing.
 */
export const locateSection = (
  path: SitePath,
): {
  pkg: PackageEntry;
  section: PackageSection;
  previous: PackageSection;
  next: PackageSection | undefined;
} => {
  for (const pkg of PACKAGES) {
    const index = pkg.sections.findIndex((section) => section.path === path);
    // at(-1) は末尾を返すので、見つからない場合と先頭の前は index で弾く
    const section = index === -1 ? undefined : pkg.sections.at(index);
    if (section === undefined) continue;
    return {
      pkg,
      section,
      previous:
        (index === 0 ? undefined : pkg.sections.at(index - 1)) ??
        ({ path: pkg.path, label: () => pkg.name } satisfies PackageSection),
      next: pkg.sections.at(index + 1),
    };
  }
  throw new Error(`${path} is not a section of any package in PACKAGES`);
};
