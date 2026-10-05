import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerAnimate;

const FADE = `import { Outlet } from '@k8ordo/router';
import { ViewTransition } from 'react';

export function Shell() {
  return (
    <>
      <header>…</header>
      <ViewTransition
        default="none"
        update={{ navigation: 'auto', default: 'none' }}
      >
        <Outlet />
      </ViewTransition>
    </>
  );
}`;

const DIRECTION = `<ViewTransition
  default="none"
  update={{
    'navigation-push': 'slide-forward',
    'navigation-replace': 'slide-forward',
    'navigation-traverse': 'slide-back',
    default: 'none',
  }}
>
  <Outlet />
</ViewTransition>`;

const DIRECTION_CSS = `@keyframes slide-from-right {
  from {
    opacity: 0;
    translate: 32px 0;
  }
}

@keyframes slide-from-left {
  from {
    opacity: 0;
    translate: -32px 0;
  }
}

::view-transition-new(.slide-forward) {
  animation: 200ms ease-out both slide-from-right;
}

::view-transition-new(.slide-back) {
  animation: 200ms ease-out both slide-from-left;
}`;

const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none;
  }
}`;

const FRAMEWORK = `import type { LayoutProps } from '@k8ordo/router';
import { ViewTransition } from 'react';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <ViewTransition
          default="none"
          update={{ navigation: 'auto', default: 'none' }}
        >
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}`;

export default function RouterAnimatePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/animate">
      <DocSection
        description={t.fadeDescription}
        id="fade"
        title={t.fadeTitle}
      >
        <CodeBlock
          code={FADE}
          lang="tsx"
          marks={{ 8: 'highlight', 9: 'highlight', 10: 'highlight' }}
          title="src/shell.tsx"
        />
        <p>
          <Rich>{t.fadeUpdate()}</Rich>
        </p>
        <p>
          <Rich>{t.fadeSite()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.typesDescription}
        id="types"
        title={t.typesTitle}
      >
        <p>
          <Rich>{t.typesWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.typesState()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.directionDescription}
        id="direction"
        title={t.directionTitle}
      >
        <p>
          <Rich>{t.directionKinds()}</Rich>
        </p>
        <CodeBlock code={DIRECTION} lang="tsx" title="src/shell.tsx" />
        <p>
          <Rich>{t.directionCss()}</Rich>
        </p>
        <CodeBlock code={DIRECTION_CSS} lang="css" title="src/app.css" />
      </DocSection>

      <DocSection
        description={t.motionDescription}
        id="reduced-motion"
        title={t.motionTitle}
      >
        <CodeBlock code={REDUCED_MOTION} lang="css" title="src/app.css" />
      </DocSection>

      <DocSection
        description={t.frameworkDescription}
        id="framework"
        title={t.frameworkTitle}
      >
        <CodeBlock
          code={FRAMEWORK}
          lang="tsx"
          marks={{ 8: 'highlight', 12: 'highlight' }}
          title="src/routes/layout.tsx"
        />
        <Note>
          <p>
            <Rich>{t.frameworkServer()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
