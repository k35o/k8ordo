import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';
import type { Mode } from './mode';

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
};

const shared = m.frameworkTroubleshooting;
const staticOwn = m.staticTroubleshooting;
const serverOwn = m.serverTroubleshooting;

const SHARED: readonly Symptom[] = [
  {
    id: 'hydration',
    title: shared.hydrationTitle,
    cause: shared.hydrationCause,
    fix: shared.hydrationFix,
  },
  {
    id: 'types',
    title: shared.typesTitle,
    cause: shared.typesCause,
    fix: shared.typesFix,
  },
  {
    id: 'fresh-clone',
    title: shared.freshTitle,
    cause: shared.freshCause,
    fix: shared.freshFix,
  },
  {
    id: 'grammar',
    title: shared.grammarTitle,
    cause: shared.grammarCause,
    fix: shared.grammarFix,
  },
  {
    id: 'sync-schema',
    title: shared.syncTitle,
    cause: shared.syncCause,
    fix: shared.syncFix,
  },
  {
    id: 'server-only',
    title: shared.serverOnlyTitle,
    cause: shared.serverOnlyCause,
    fix: shared.serverOnlyFix,
  },
  {
    id: 'functions',
    title: shared.functionsTitle,
    cause: shared.functionsCause,
    fix: shared.functionsFix,
  },
  {
    id: 'route-hook',
    title: shared.routeHookTitle,
    cause: shared.routeHookCause,
    fix: shared.routeHookFix,
  },
];

const OWN: Readonly<Record<Mode, readonly Symptom[]>> = {
  static: [
    {
      id: 'paths',
      title: staticOwn.pathsTitle,
      cause: staticOwn.pathsCause,
      fix: staticOwn.pathsFix,
    },
    {
      id: 'unused-paths',
      title: staticOwn.unusedTitle,
      cause: staticOwn.unusedCause,
      fix: staticOwn.unusedFix,
    },
    {
      id: 'server-actions',
      title: staticOwn.actionsTitle,
      cause: staticOwn.actionsCause,
      fix: staticOwn.actionsFix,
    },
    {
      id: 'guard',
      title: staticOwn.guardTitle,
      cause: staticOwn.guardCause,
      fix: staticOwn.guardFix,
    },
    {
      id: 'render',
      title: staticOwn.renderTitle,
      cause: staticOwn.renderCause,
      fix: staticOwn.renderFix,
    },
    {
      id: 'dev',
      title: staticOwn.devTitle,
      cause: staticOwn.devCause,
      fix: staticOwn.devFix,
    },
    {
      id: 'status',
      title: staticOwn.statusTitle,
      cause: staticOwn.statusCause,
      fix: staticOwn.statusFix,
    },
    {
      id: 'csp',
      title: staticOwn.cspTitle,
      cause: staticOwn.cspCause,
      fix: staticOwn.cspFix,
    },
  ],
  server: [
    {
      id: 'forbidden',
      title: serverOwn.forbiddenTitle,
      cause: serverOwn.forbiddenCause,
      fix: serverOwn.forbiddenFix,
    },
    {
      id: 'redirect',
      title: serverOwn.redirectTitle,
      cause: serverOwn.redirectCause,
      fix: serverOwn.redirectFix,
    },
    {
      id: 'render-api',
      title: serverOwn.renderApiTitle,
      cause: serverOwn.renderApiCause,
      fix: serverOwn.renderApiFix,
    },
    {
      id: 'internal-error',
      title: serverOwn.internalTitle,
      cause: serverOwn.internalCause,
      fix: serverOwn.internalFix,
    },
    {
      id: 'insecure-cookie',
      title: serverOwn.insecureTitle,
      cause: serverOwn.insecureCause,
      fix: serverOwn.insecureFix,
    },
    {
      id: 'same-site',
      title: serverOwn.sameSiteTitle,
      cause: serverOwn.sameSiteCause,
      fix: serverOwn.sameSiteFix,
    },
  ],
};

/**
 * The mode's own symptoms first — what its build or its server stops with —
 * then the ones both modes share. A function rather than a component, so
 * `DocPage` sees the sections it returns and lists them in the contents.
 */
export const troubleshootingSections = (mode: Mode) => {
  const t = m.frameworkTroubleshooting;
  return (
    <>
      {[...OWN[mode], ...SHARED].map((symptom) => (
        <DocSection id={symptom.id} key={symptom.id} title={symptom.title}>
          <Heading level="h3">{t.causeLabel()}</Heading>
          <p>
            <Rich>{symptom.cause()}</Rich>
          </p>
          <Heading level="h3">{t.fixLabel()}</Heading>
          <p>
            <Rich>{symptom.fix()}</Rich>
          </p>
        </DocSection>
      ))}
    </>
  );
};
