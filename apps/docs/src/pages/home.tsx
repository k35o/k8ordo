'use client';

import {
  AccessibilityIcon,
  AtomIcon,
  Button,
  GitHubIcon,
  Heading,
  PaletteIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VerticalWritingIcon,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { T } from '../components/t';
import { localizeHref, useTranslation } from '../i18n';
import type { MessageKey } from '../i18n/types';

type Feature = {
  title: MessageKey;
  description: MessageKey;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: 'home.featureReact',
    description: 'home.featureReactDescription',
    icon: <AtomIcon />,
  },
  {
    title: 'home.featureTokens',
    description: 'home.featureTokensDescription',
    icon: <PaletteIcon />,
  },
  {
    title: 'home.featureTypeScript',
    description: 'home.featureTypeScriptDescription',
    icon: <ShieldCheckIcon />,
  },
  {
    title: 'home.featureAccessible',
    description: 'home.featureAccessibleDescription',
    icon: <AccessibilityIcon />,
  },
  {
    title: 'home.featureMinimal',
    description: 'home.featureMinimalDescription',
    icon: <SparklesIcon />,
  },
  {
    title: 'home.featureVerticalWriting',
    description: 'home.featureVerticalWritingDescription',
    icon: <VerticalWritingIcon />,
  },
];

export function Home() {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_auto] md:gap-16 md:px-8 md:py-28">
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
          {/* md 以上はタグラインを縦書き短冊が担う */}
          <p
            className="font-m-plus-2 font-palt text-fg-base break-phrase text-lg font-medium md:hidden"
            lang="ja"
          >
            触れるものは柔らかく、読むものは端正に。
          </p>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {t('home.description')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href={localizeHref('/ui/get-started', locale)}
                >
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              {t('home.getStarted')}
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href={localizeHref('/ui/components', locale)}
                >
                  {children}
                </a>
              )}
              size="md"
              variant="outline"
            >
              {t('home.viewComponents')}
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
              {t('home.github')}
            </Button>
          </div>
        </div>
        {/* 縦組みの短冊（題簽）。ブランド図像として両ロケール共通の日本語。
            vertical-rl では改行後の行が左に積まれ、右から左へ正しい読み順になる */}
        <div className="hidden justify-end md:flex">
          <p
            className="font-m-plus-2 font-palt writing-v text-fg-base h-104 text-2xl leading-loose font-medium"
            lang="ja"
          >
            触れるものは柔らかく、
            <br />
            読むものは端正に。
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('home.featuresTitle')}</Heading>
        <ol className="mt-8">
          {FEATURES.map((feature) => (
            <li
              className="border-border-mute border-t last:border-b"
              key={feature.title}
            >
              {/* min-h は py-6(計3rem) + 説明2行分。1行説明の行も同じ高さに揃え、罫線を等間隔に保つ */}
              <div className="grid min-h-24 items-start gap-4 py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                <p className="text-fg-base flex items-center gap-2 font-medium">
                  <span className="text-fg-mute">{feature.icon}</span>
                  {t(feature.title)}
                </p>
                <p className="text-fg-mute text-sm leading-relaxed">
                  <T k={feature.description} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
