'use client';

import type { Message } from '@k8ordo/i18n';
import {
  AccessibilityIcon,
  AIIcon,
  AtomIcon,
  Button,
  Heading,
  PaletteIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VerticalWritingIcon,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { PageTitle } from '../../../components/page-title';
import { Rich } from '../../../components/rich';
import { href } from '../../../links';
import * as m from '../../../messages';

type Feature = {
  title: Message;
  description: Message;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: m.ui.featureReact,
    description: m.ui.featureReactDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.ui.featureTokens,
    description: m.ui.featureTokensDescription,
    icon: <PaletteIcon />,
  },
  {
    title: m.ui.featureTypeScript,
    description: m.ui.featureTypeScriptDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.ui.featureAgents,
    description: m.ui.featureAgentsDescription,
    icon: <AIIcon />,
  },
  {
    title: m.ui.featureAccessible,
    description: m.ui.featureAccessibleDescription,
    icon: <AccessibilityIcon />,
  },
  {
    title: m.ui.featureMinimal,
    description: m.ui.featureMinimalDescription,
    icon: <SparklesIcon />,
  },
  {
    title: m.ui.featureVerticalWriting,
    description: m.ui.featureVerticalWritingDescription,
    icon: <VerticalWritingIcon />,
  },
];

export default function Ui() {
  return (
    <div className="flex flex-1 flex-col">
      <PageTitle name="@k8ordo/ui" />
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_auto] md:gap-16 md:px-8 md:py-28">
        <div className="flex max-w-xl flex-col justify-center gap-8">
          <Heading level="h1">@k8ordo/ui</Heading>
          {/* md 以上はタグラインを縦書き短冊が担う */}
          <p
            className="font-m-plus-2 font-palt text-fg-base break-phrase text-lg font-medium md:hidden"
            lang="ja"
          >
            触れるものは柔らかく、読むものは端正に。
          </p>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {m.ui.description()}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a className={className} href={href('/:locale/ui/get-started')}>
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              {m.ui.getStarted()}
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a className={className} href={href('/:locale/ui/components')}>
                  {children}
                </a>
              )}
              size="md"
              variant="outline"
            >
              {m.ui.viewComponents()}
            </Button>
          </div>
        </div>
        {/* 縦組みの短冊（題簽）。@k8ordo/ui のデザイン指針を表すもので、
            ブランド図像として両ロケール共通の日本語。
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
        <Heading level="h2">{m.ui.featuresTitle()}</Heading>
        <ol className="mt-8">
          {FEATURES.map((feature) => (
            <li
              className="border-border-mute border-t last:border-b"
              key={feature.title()}
            >
              {/* min-h は py-6(計3rem) + 説明2行分。1行説明の行も同じ高さに揃え、罫線を等間隔に保つ */}
              <div className="grid min-h-24 items-start gap-4 py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                <p className="text-fg-base flex items-center gap-2 font-medium">
                  <span className="text-fg-mute">{feature.icon}</span>
                  {feature.title()}
                </p>
                <p className="text-fg-mute text-sm leading-relaxed">
                  <Rich>{feature.description()}</Rich>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
