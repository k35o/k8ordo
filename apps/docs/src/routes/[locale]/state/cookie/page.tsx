import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateCookie;

const DEFINE = `import { defineCookieState } from '@k8ordo/state';
import * as z from 'zod';

export const density = defineCookieState(
  'density',
  z.object({
    density: z
      .enum(['comfortable', 'compact'])
      .default('comfortable'),
  }),
);`;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/router';

import { density } from '../state';
import { Shell } from './shell';

export default function Layout({
  request,
  children,
}: LayoutProps<'/'>) {
  return (
    <Shell initialCookie={density.parseCookies(request.cookies)}>
      {children}
    </Shell>
  );
}`;

const SHELL = `'use client';

import { useAppState } from '@k8ordo/state';
import type { OutputOf } from '@k8ordo/state';
import type { ReactNode } from 'react';

import { density } from '../state';

type Props = {
  initialCookie: OutputOf<typeof density.schema>;
  children: ReactNode;
};

export function Shell({ initialCookie, children }: Props) {
  const [values] = useAppState(density, { initialCookie });

  return <div data-density={values.density}>{children}</div>;
}`;

const ACTION = `'use server';

import { cookies } from '@k8ordo/server/runtime';

import { density } from './state';

export async function compact() {
  cookies().set(
    density.cookieName,
    density.cookieValue({ density: 'compact' }),
    { httpOnly: false, maxAge: 34_560_000 },
  );
}`;

export default function StateCookiePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/cookie">
      <DocSection
        description={t.defineDescription}
        id="define"
        title={t.defineTitle}
      >
        <CodeBlock code={DEFINE} lang="ts" title="state.ts" />
        <p>
          <Rich>{t.defineName()}</Rich>
        </p>
        <p>
          <Rich>{t.defineToken()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.readDescription}
        id="read"
        title={t.readTitle}
      >
        <CodeBlock
          code={LAYOUT}
          lang="tsx"
          marks={{ 11: 'highlight' }}
          title="routes/layout.tsx"
        />
        <CodeBlock
          code={SHELL}
          lang="tsx"
          marks={{ 15: 'highlight' }}
          title="routes/shell.tsx"
        />
        <p>
          <Rich>{t.readMap()}</Rich>
        </p>
        <p>
          <Rich>{t.readSeed()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.seedDescription}
        id="seed"
        title={t.seedTitle}
      >
        <p>
          <Rich>{t.seedHigh()}</Rich>
        </p>
        <p>
          <Rich>{t.seedStatic()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.attributesDescription}
        id="attributes"
        title={t.attributesTitle}
      >
        <ul>
          {[
            t.attributesPath,
            t.attributesSameSite,
            t.attributesMaxAge,
            t.attributesSecure,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.attributesRead()}</Rich>
        </p>
        <p>
          <Rich>{t.attributesSize()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverWriteDescription}
        id="server-write"
        title={t.serverWriteTitle}
      >
        <p>
          <Rich>{t.serverWriteForm()}</Rich>
        </p>
        <CodeBlock
          code={ACTION}
          lang="ts"
          marks={{ 9: 'highlight', 10: 'highlight', 11: 'highlight' }}
          title="actions.ts"
        />
        <p>
          <Rich>{t.serverWriteHttpOnly()}</Rich>
        </p>
        <p>
          <Rich>{t.serverWriteEncode()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.secretDescription}
        id="secret"
        title={t.secretTitle}
      >
        <Pitfall>
          <p>
            <Rich>{t.secretPitfall()}</Rich>
          </p>
        </Pitfall>
        <p>
          <Rich>{t.secretInput()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
