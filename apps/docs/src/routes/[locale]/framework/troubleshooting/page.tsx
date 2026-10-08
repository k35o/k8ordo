import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkTroubleshooting;

type Symptom = {
  id: string;
  title: Message;
  cause: Message;
  fix: Message;
};

const SYMPTOMS: readonly Symptom[] = [
  {
    id: 'wants-server',
    title: t.wantsServerTitle,
    cause: t.wantsServerCause,
    fix: t.wantsServerFix,
  },
  { id: 'paths', title: t.pathsTitle, cause: t.pathsCause, fix: t.pathsFix },
  {
    id: 'unused-paths',
    title: t.unusedTitle,
    cause: t.unusedCause,
    fix: t.unusedFix,
  },
  {
    id: 'held',
    title: t.heldTitle,
    cause: t.heldCause,
    fix: t.heldFix,
  },
  {
    id: 'misnamed',
    title: t.misnamedTitle,
    cause: t.misnamedCause,
    fix: t.misnamedFix,
  },
  {
    id: 'shell-locations',
    title: t.shellLocationsTitle,
    cause: t.shellLocationsCause,
    fix: t.shellLocationsFix,
  },
  {
    id: 'reserved',
    title: t.reservedTitle,
    cause: t.reservedCause,
    fix: t.reservedFix,
  },
  {
    id: 'shadowed',
    title: t.shadowedTitle,
    cause: t.shadowedCause,
    fix: t.shadowedFix,
  },
  {
    id: 'shell-refused',
    title: t.shellRefusedTitle,
    cause: t.shellRefusedCause,
    fix: t.shellRefusedFix,
  },
  {
    id: 'shell-not-found',
    title: t.shellNotFoundTitle,
    cause: t.shellNotFoundCause,
    fix: t.shellNotFoundFix,
  },
  {
    id: 'shell-taken',
    title: t.shellTakenTitle,
    cause: t.shellTakenCause,
    fix: t.shellTakenFix,
  },
  {
    id: 'render',
    title: t.renderTitle,
    cause: t.renderCause,
    fix: t.renderFix,
  },
  { id: 'dev', title: t.devTitle, cause: t.devCause, fix: t.devFix },
  {
    id: 'status',
    title: t.statusTitle,
    cause: t.statusCause,
    fix: t.statusFix,
  },
  {
    id: 'github-pages',
    title: t.githubPagesTitle,
    cause: t.githubPagesCause,
    fix: t.githubPagesFix,
  },
  {
    id: 'cloudflare-shell',
    title: t.cloudflareShellTitle,
    cause: t.cloudflareShellCause,
    fix: t.cloudflareShellFix,
  },
  {
    id: 'cloudflare-loop',
    title: t.cloudflareLoopTitle,
    cause: t.cloudflareLoopCause,
    fix: t.cloudflareLoopFix,
  },
  {
    id: 'cannot-list',
    title: t.cannotListTitle,
    cause: t.cannotListCause,
    fix: t.cannotListFix,
  },
  {
    id: 'own-redirects',
    title: t.ownRedirectsTitle,
    cause: t.ownRedirectsCause,
    fix: t.ownRedirectsFix,
  },
  {
    id: 'vercel-redirects',
    title: t.vercelRedirectsTitle,
    cause: t.vercelRedirectsCause,
    fix: t.vercelRedirectsFix,
  },
  {
    id: 'shell-html',
    title: t.shellHtmlTitle,
    cause: t.shellHtmlCause,
    fix: t.shellHtmlFix,
  },
  { id: 'csp', title: t.cspTitle, cause: t.cspCause, fix: t.cspFix },
  {
    id: 'forbidden',
    title: t.forbiddenTitle,
    cause: t.forbiddenCause,
    fix: t.forbiddenFix,
  },
  {
    id: 'redirect',
    title: t.redirectTitle,
    cause: t.redirectCause,
    fix: t.redirectFix,
  },
  {
    id: 'render-api',
    title: t.renderApiTitle,
    cause: t.renderApiCause,
    fix: t.renderApiFix,
  },
  {
    id: 'internal-error',
    title: t.internalTitle,
    cause: t.internalCause,
    fix: t.internalFix,
  },
  {
    id: 'insecure-cookie',
    title: t.insecureTitle,
    cause: t.insecureCause,
    fix: t.insecureFix,
  },
  {
    id: 'same-site',
    title: t.sameSiteTitle,
    cause: t.sameSiteCause,
    fix: t.sameSiteFix,
  },
  {
    id: 'hydration',
    title: t.hydrationTitle,
    cause: t.hydrationCause,
    fix: t.hydrationFix,
  },
  { id: 'types', title: t.typesTitle, cause: t.typesCause, fix: t.typesFix },
  {
    id: 'fresh-clone',
    title: t.freshTitle,
    cause: t.freshCause,
    fix: t.freshFix,
  },
  {
    id: 'grammar',
    title: t.grammarTitle,
    cause: t.grammarCause,
    fix: t.grammarFix,
  },
  {
    id: 'fallback-grammar',
    title: t.fallbackGrammarTitle,
    cause: t.fallbackGrammarCause,
    fix: t.fallbackGrammarFix,
  },
  { id: 'sync-schema', title: t.syncTitle, cause: t.syncCause, fix: t.syncFix },
  {
    id: 'server-only',
    title: t.serverOnlyTitle,
    cause: t.serverOnlyCause,
    fix: t.serverOnlyFix,
  },
  {
    id: 'functions',
    title: t.functionsTitle,
    cause: t.functionsCause,
    fix: t.functionsFix,
  },
  {
    id: 'route-hook',
    title: t.routeHookTitle,
    cause: t.routeHookCause,
    fix: t.routeHookFix,
  },
];

export default function FrameworkTroubleshootingPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/framework/troubleshooting"
    >
      {SYMPTOMS.map((symptom) => (
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
    </DocPage>
  );
}
