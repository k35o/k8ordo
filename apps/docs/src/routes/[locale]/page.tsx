'use client';

import { Button, GitHubIcon, Heading } from '@k8ordo/ui';

import { T } from '../../components/t';
import { localizeHref, useTranslation } from '../../i18n';
import type { MessageKey } from '../../i18n/types';

type Package = {
  name: string;
  path: string;
  description: MessageKey;
};

const PACKAGES: Package[] = [
  {
    name: '@k8ordo/ui',
    path: '/ui',
    description: 'home.memberUiDescription',
  },
  {
    name: '@k8ordo/form',
    path: '/form',
    description: 'home.memberFormDescription',
  },
  {
    name: '@k8ordo/state',
    path: '/state',
    description: 'home.memberStateDescription',
  },
  {
    name: '@k8ordo/router',
    path: '/router',
    description: 'router.description',
  },
  {
    name: '@k8ordo/static',
    path: '/static',
    description: 'static.description',
  },
  {
    name: '@k8ordo/server',
    path: '/server',
    description: 'server.description',
  },
];

type Discipline = { title: MessageKey; description: MessageKey };

const DISCIPLINES: Discipline[] = [
  {
    title: 'home.disciplinePlatform',
    description: 'home.disciplinePlatformDescription',
  },
  {
    title: 'home.disciplineReact',
    description: 'home.disciplineReactDescription',
  },
  {
    title: 'home.disciplineTypes',
    description: 'home.disciplineTypesDescription',
  },
  {
    title: 'home.disciplineAgents',
    description: 'home.disciplineAgentsDescription',
  },
];

export default function Home() {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
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
            {t('home.description')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a className={className} href={localizeHref('/ui', locale)}>
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              {t('home.exploreUi')}
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
              {t('common.github')}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-8">
        <Heading level="h2">{t('home.membersTitle')}</Heading>
        <ul className="mt-8 flex flex-col gap-4">
          {PACKAGES.map((pkg) => (
            <li key={pkg.name}>
              <a
                className="border-border-mute hover:bg-bg-mute focus-visible:ring-border-info flex flex-col gap-2 rounded-lg border p-6 transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden"
                href={localizeHref(pkg.path, locale)}
              >
                <span className="text-fg-base font-medium">{pkg.name}</span>
                <span className="text-fg-mute text-sm leading-relaxed">
                  <T k={pkg.description} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('home.disciplineTitle')}</Heading>
        <ol className="mt-8">
          {DISCIPLINES.map((discipline) => (
            <li
              className="border-border-mute border-t last:border-b"
              key={discipline.title}
            >
              <div className="grid min-h-24 items-start gap-4 py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                <p className="text-fg-base font-medium">
                  {t(discipline.title)}
                </p>
                <p className="text-fg-mute text-sm leading-relaxed">
                  <T k={discipline.description} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
