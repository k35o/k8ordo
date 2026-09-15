'use client';

import type { Message } from '@k8ordo/i18n';
import { Button, GitHubIcon, Heading } from '@k8ordo/ui';

import { Rich } from '../../components/rich';
import { href } from '../../links';
import type { SitePath } from '../../links';
import * as m from '../../messages';

type Package = {
  name: string;
  path: SitePath;
  description: Message;
};

const PACKAGES: Package[] = [
  {
    name: '@k8ordo/ui',
    path: '/:locale/ui',
    description: m.home.memberUiDescription,
  },
  {
    name: '@k8ordo/form',
    path: '/:locale/form',
    description: m.home.memberFormDescription,
  },
  {
    name: '@k8ordo/state',
    path: '/:locale/state',
    description: m.home.memberStateDescription,
  },
  {
    name: '@k8ordo/router',
    path: '/:locale/router',
    description: m.router.description,
  },
  {
    name: '@k8ordo/static',
    path: '/:locale/static',
    description: m.static.description,
  },
  {
    name: '@k8ordo/server',
    path: '/:locale/server',
    description: m.server.description,
  },
  {
    name: '@k8ordo/i18n',
    path: '/:locale/i18n',
    description: m.i18n.description,
  },
];

type Discipline = { title: Message; description: Message };

const DISCIPLINES: Discipline[] = [
  {
    title: m.home.disciplinePlatform,
    description: m.home.disciplinePlatformDescription,
  },
  {
    title: m.home.disciplineReact,
    description: m.home.disciplineReactDescription,
  },
  {
    title: m.home.disciplineTypes,
    description: m.home.disciplineTypesDescription,
  },
  {
    title: m.home.disciplineAgents,
    description: m.home.disciplineAgentsDescription,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* サイトの表紙だけは「k8ordo · k8ordo」にならないよう素の title */}
      <title>k8ordo</title>
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-xl flex-col justify-center gap-8">
          {/* Heading は className を受けないため、ヒーローのみ生 h1（サイト内この1箇所限定） */}
          {/* 320px級の画面でも1語の "k8ordo" がはみ出さないよう、
              sm未満のみ 3xl〜emphasize の範囲で流動サイズにする */}
          <h1 className="font-m-plus-2 font-palt text-fg-base sm:text-emphasize text-[clamp(1.875rem,12vw,3rem)] leading-none font-bold">
            k8ordo
            <span
              aria-hidden
              className="bg-primary-border ml-1.5 inline-block size-3 rounded-full"
            />
          </h1>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {m.home.description()}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a className={className} href={href('/:locale/ui')}>
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              {m.home.exploreUi()}
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://github.com/k35o/k8ordo"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              startIcon={<GitHubIcon />}
              variant="skeleton"
            >
              {m.common.github()}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-8">
        <Heading level="h2">{m.home.membersTitle()}</Heading>
        <ul className="mt-8 flex flex-col gap-4">
          {PACKAGES.map((pkg) => (
            <li key={pkg.name}>
              <a
                className="border-border-mute hover:bg-bg-mute focus-visible:ring-border-info flex flex-col gap-2 rounded-lg border p-6 transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden"
                href={href(pkg.path)}
              >
                <span className="text-fg-base font-medium">{pkg.name}</span>
                <span className="text-fg-mute text-sm leading-relaxed">
                  <Rich>{pkg.description()}</Rich>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{m.home.disciplineTitle()}</Heading>
        <ol className="mt-8">
          {DISCIPLINES.map((discipline) => (
            <li
              className="border-border-mute border-t last:border-b"
              key={discipline.title()}
            >
              <div className="grid min-h-24 items-start gap-4 py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                <p className="text-fg-base font-medium">{discipline.title()}</p>
                <p className="text-fg-mute text-sm leading-relaxed">
                  <Rich>{discipline.description()}</Rich>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
