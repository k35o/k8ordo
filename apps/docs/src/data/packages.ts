import type { Message } from '@k8ordo/i18n';

import type { SitePath } from '../links';
import * as m from '../messages';

export type PackageSection = { path: SitePath; label: Message };

/** A heading in the package's sidebar, with its pages in reading order. */
export type PackageGroup = {
  label: Message;
  sections: [PackageSection, ...PackageSection[]];
};

export type PackageEntry = {
  /** The published name, e.g. `@k8ordo/router`. */
  name: string;
  /** The short name the header shows. */
  label: string;
  path: SitePath;
  /** What the home page says about it. */
  description: Message;
  /** In reading order: the sidebar and the pager both follow it. */
  groups: [PackageGroup, ...PackageGroup[]];
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
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/ui/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/ui/theming', label: m.nav.theming },
          { path: '/:locale/ui/i18n', label: m.nav.i18n },
        ],
      },
      {
        label: m.nav.groupCatalog,
        sections: [
          { path: '/:locale/ui/components', label: m.nav.components },
          { path: '/:locale/ui/ai', label: m.nav.ai },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/form',
    label: 'Form',
    path: '/:locale/form',
    description: m.home.memberFormDescription,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/form/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/form/field-types', label: m.form.navFieldTypes },
          { path: '/:locale/form/nested', label: m.form.navNested },
          { path: '/:locale/form/errors', label: m.form.navErrors },
          { path: '/:locale/form/rules', label: m.form.navRules },
          { path: '/:locale/form/edit', label: m.form.navEdit },
          {
            path: '/:locale/form/async-check',
            label: m.form.navAsyncCheck,
          },
          {
            path: '/:locale/form/custom-inputs',
            label: m.form.navCustomInputs,
          },
          { path: '/:locale/form/multi-step', label: m.form.navMultiStep },
          { path: '/:locale/form/search', label: m.form.navSearch },
          { path: '/:locale/form/with-ui', label: m.form.navWithUi },
        ],
      },
      {
        label: m.nav.groupConcepts,
        sections: [
          { path: '/:locale/form/how-it-works', label: m.form.navHowItWorks },
        ],
      },
      {
        label: m.nav.groupReference,
        sections: [
          {
            path: '/:locale/form/reference/server',
            label: m.form.navReferenceServer,
          },
          {
            path: '/:locale/form/reference/client',
            label: m.form.navReferenceClient,
          },
          {
            path: '/:locale/form/reference/schema',
            label: m.form.navReferenceSchema,
          },
          {
            path: '/:locale/form/troubleshooting',
            label: m.form.navTroubleshooting,
          },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/state',
    label: 'State',
    path: '/:locale/state',
    description: m.home.memberStateDescription,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/state/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/state/places', label: m.state.navPlaces },
          { path: '/:locale/state/reading', label: m.state.navReading },
          { path: '/:locale/state/updates', label: m.state.navUpdates },
          {
            path: '/:locale/state/integrations',
            label: m.state.navIntegrations,
          },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/router',
    label: 'Router',
    path: '/:locale/router',
    description: m.router.description,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/router/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/router/routes', label: m.router.navRoutes },
          { path: '/:locale/router/boundaries', label: m.router.navBoundaries },
          { path: '/:locale/router/links', label: m.router.navLinks },
          { path: '/:locale/router/location', label: m.router.navLocation },
          {
            path: '/:locale/router/bind-params',
            label: m.router.navBindParams,
          },
          {
            path: '/:locale/router/typed-paths',
            label: m.router.navTypedPaths,
          },
          { path: '/:locale/router/base', label: m.router.navBase },
          { path: '/:locale/router/animate', label: m.router.navAnimate },
          { path: '/:locale/router/framework', label: m.router.navFramework },
          { path: '/:locale/router/testing', label: m.router.navTesting },
        ],
      },
      {
        label: m.nav.groupConcepts,
        sections: [
          {
            path: '/:locale/router/how-it-works',
            label: m.router.navHowItWorks,
          },
        ],
      },
      {
        label: m.nav.groupReference,
        sections: [
          { path: '/:locale/router/reference', label: m.router.navReference },
          {
            path: '/:locale/router/troubleshooting',
            label: m.router.navTroubleshooting,
          },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/static',
    label: 'Static',
    path: '/:locale/static',
    description: m.static.description,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/static/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/static/routing', label: m.static.navRouting },
          { path: '/:locale/static/params', label: m.static.navParams },
          { path: '/:locale/static/errors', label: m.static.navErrors },
          { path: '/:locale/static/boundaries', label: m.static.navBoundaries },
          { path: '/:locale/static/deploy', label: m.static.navDeploy },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/server',
    label: 'Server',
    path: '/:locale/server',
    description: m.server.description,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/server/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/server/routing', label: m.server.navRouting },
          { path: '/:locale/server/params', label: m.server.navParams },
          { path: '/:locale/server/errors', label: m.server.navErrors },
          { path: '/:locale/server/boundaries', label: m.server.navBoundaries },
          { path: '/:locale/server/actions', label: m.server.navActions },
          { path: '/:locale/server/guards', label: m.server.navGuards },
          { path: '/:locale/server/deploy', label: m.server.navDeploy },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/i18n',
    label: 'i18n',
    path: '/:locale/i18n',
    description: m.i18n.description,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          { path: '/:locale/i18n/get-started', label: m.nav.getStarted },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          { path: '/:locale/i18n/locales', label: m.i18n.navLocales },
          { path: '/:locale/i18n/messages', label: m.i18n.navMessages },
          { path: '/:locale/i18n/formatting', label: m.i18n.navFormatting },
          { path: '/:locale/i18n/routing', label: m.i18n.navRouting },
          { path: '/:locale/i18n/switch', label: m.i18n.navSwitch },
          { path: '/:locale/i18n/negotiate', label: m.i18n.navNegotiate },
          { path: '/:locale/i18n/static', label: m.i18n.navStatic },
          { path: '/:locale/i18n/integrations', label: m.i18n.navIntegrations },
          { path: '/:locale/i18n/testing', label: m.i18n.navTesting },
        ],
      },
      {
        label: m.nav.groupConcepts,
        sections: [
          { path: '/:locale/i18n/how-it-works', label: m.i18n.navHowItWorks },
        ],
      },
    ],
  },
  {
    name: '@k8ordo/color-scheme',
    label: 'Color scheme',
    path: '/:locale/color-scheme',
    description: m.colorScheme.description,
    groups: [
      {
        label: m.nav.groupStart,
        sections: [
          {
            path: '/:locale/color-scheme/get-started',
            label: m.nav.getStarted,
          },
        ],
      },
      {
        label: m.nav.groupGuides,
        sections: [
          {
            path: '/:locale/color-scheme/styling',
            label: m.colorScheme.navStyling,
          },
          {
            path: '/:locale/color-scheme/switcher',
            label: m.colorScheme.navSwitcher,
          },
          {
            path: '/:locale/color-scheme/storage',
            label: m.colorScheme.navStorage,
          },
          { path: '/:locale/color-scheme/csp', label: m.colorScheme.navCsp },
          {
            path: '/:locale/color-scheme/testing',
            label: m.colorScheme.navTesting,
          },
        ],
      },
      {
        label: m.nav.groupConcepts,
        sections: [
          {
            path: '/:locale/color-scheme/how-it-works',
            label: m.colorScheme.navHowItWorks,
          },
        ],
      },
      {
        label: m.nav.groupReference,
        sections: [
          {
            path: '/:locale/color-scheme/reference',
            label: m.colorScheme.navReference,
          },
          {
            path: '/:locale/color-scheme/troubleshooting',
            label: m.colorScheme.navTroubleshooting,
          },
        ],
      },
    ],
  },
];

/** A package's pages in reading order, across its groups. */
export const sectionsOf = (pkg: PackageEntry): PackageSection[] =>
  pkg.groups.flatMap((group) => group.sections);

/**
 * Where a section page sits: its package, its group, itself, and its
 * neighbours in reading order. The first section's previous page is the
 * package's landing.
 */
export const locateSection = (
  path: SitePath,
): {
  pkg: PackageEntry;
  group: PackageGroup;
  section: PackageSection;
  previous: PackageSection;
  next: PackageSection | undefined;
} => {
  for (const pkg of PACKAGES) {
    const sections = sectionsOf(pkg);
    const index = sections.findIndex((section) => section.path === path);
    // at(-1) は末尾を返すので、見つからない場合と先頭の前は index で弾く
    const section = index === -1 ? undefined : sections.at(index);
    if (section === undefined) continue;
    const group = pkg.groups.find((entry) => entry.sections.includes(section));
    if (group === undefined) continue;
    return {
      pkg,
      group,
      section,
      previous:
        (index === 0 ? undefined : sections.at(index - 1)) ??
        ({ path: pkg.path, label: () => pkg.name } satisfies PackageSection),
      next: sections.at(index + 1),
    };
  }
  throw new Error(`${path} is not a section of any package in PACKAGES`);
};
