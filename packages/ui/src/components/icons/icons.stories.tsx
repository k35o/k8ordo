import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC } from 'react';
import { expect } from 'storybook/test';

import { ColorScaleIcon } from './color-scale';
import { GitHubIcon } from './github-mark';
import { LogoIcon } from './logo';
import {
  AIIcon,
  AlertIcon,
  BadIcon,
  BlogIcon,
  BoringIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  CodeXmlIcon,
  ColorContrastIcon,
  ColorInfoIcon,
  CopyIcon,
  DarkModeIcon,
  DifficultIcon,
  EasyIcon,
  ExternalLinkIcon,
  FlaskIcon,
  FormIcon,
  GoodIcon,
  HistoryIcon,
  HorizontalWritingIcon,
  InformativeIcon,
  InterestingIcon,
  LightModeIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  MailIcon,
  MinusIcon,
  MixedColorIcon,
  NavigationMenuIcon,
  NewsIcon,
  PackageIcon,
  PlusIcon,
  PrepareIcon,
  PublishDateIcon,
  RefreshIcon,
  RSSIcon,
  SendIcon,
  ShallowIcon,
  SlideIcon,
  SquircleIcon,
  SubscribeIcon,
  TableIcon,
  TagIcon,
  UpdateDateIcon,
  ViewIcon,
} from './lucide';
import { QiitaIcon } from './qiita';
import { TwitterIcon } from './twitter';
import { VerticalWritingIcon } from './vertical-writing';

const meta: Meta<typeof SVGAElement> = {
  title: 'components/icons',
};

export default meta;
type Story = StoryObj<FC>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <CheckIcon size={size} />
          <p className="text-fg-mute text-sm">{size}</p>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = [...canvasElement.querySelectorAll('svg')];
    await expect(svgs).toHaveLength(sizes.length);
    await Promise.all(
      svgs.flatMap((svg) => [
        expect(svg).toHaveAttribute('aria-hidden', 'true'),
        expect(svg).toHaveAttribute('focusable', 'false'),
      ]),
    );
  },
};

export const Primary: Story = {
  render: () => (
    <div className="grid-cols-auto-fit-36 grid place-items-center gap-4">
      <div className="flex flex-col items-center justify-center">
        <LogoIcon />
        <p className="text-center">Logo</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <CloseIcon />
        <p className="text-center">Close</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <CodeXmlIcon />
        <p className="text-center">CodeXml</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ChevronIcon direction="left" />
        <p className="text-center">Chevron Left</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ChevronIcon direction="up" />
        <p className="text-center">Chevron Up</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ChevronIcon direction="right" />
        <p className="text-center">Chevron Right</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ChevronIcon direction="down" />
        <p className="text-center">Chevron Down</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <CheckIcon />
        <p className="text-center">Check</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon status="info" />
        <p className="text-center">Info</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon status="success" />
        <p className="text-center">Success</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon status="warning" />
        <p className="text-center">Warning</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon status="error" />
        <p className="text-center">Error</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <LinkIcon />
        <p className="text-center">Link</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ExternalLinkIcon />
        <p className="text-center">External Link</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <BlogIcon />
        <p className="text-center">Blog</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <HorizontalWritingIcon />
        <p className="text-center">横書き</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <VerticalWritingIcon />
        <p className="text-center">縦書き</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SlideIcon />
        <p className="text-center">Slide</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <TagIcon />
        <p className="text-center">Tag</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <LocationIcon />
        <p className="text-center">Location</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <FormIcon />
        <p className="text-center">Form</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <TableIcon />
        <p className="text-center">Table</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ListIcon />
        <p className="text-center">List</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SquircleIcon />
        <p className="text-center">Squircle</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <FlaskIcon />
        <p className="text-center">Flask</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <PackageIcon />
        <p className="text-center">Package</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <NavigationMenuIcon />
        <p className="text-center">Navigation Menu</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <CopyIcon />
        <p className="text-center">Copy</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <PublishDateIcon />
        <p className="text-center">公開日時</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <UpdateDateIcon />
        <p className="text-center">更新日時</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SendIcon />
        <p className="text-center">送信</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <HistoryIcon />
        <p className="text-center">履歴</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <RefreshIcon />
        <p className="text-center">再読み込み</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <MailIcon />
        <p className="text-center">メール</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <PlusIcon />
        <p className="text-center">プラス</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <MinusIcon />
        <p className="text-center">マイナス</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <GoodIcon />
        <p className="text-center">良い</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <BadIcon />
        <p className="text-center">悪い</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <InformativeIcon />
        <p className="text-center">有益</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ShallowIcon />
        <p className="text-center">浅い</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <InterestingIcon />
        <p className="text-center">面白い</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <BoringIcon />
        <p className="text-center">退屈</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <EasyIcon />
        <p className="text-center">簡単</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <DifficultIcon />
        <p className="text-center">難解</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <LightModeIcon />
        <p className="text-center">ライトモード</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <DarkModeIcon />
        <p className="text-center">ダークモード</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ViewIcon />
        <p className="text-center">閲覧数</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <NewsIcon />
        <p className="text-center">お知らせ</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SubscribeIcon />
        <p className="text-center">メールの購読</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ColorInfoIcon />
        <p className="text-center">色についての情報</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ColorContrastIcon />
        <p className="text-center">コントラスト</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ColorScaleIcon />
        <p className="text-center">色の段階</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <MixedColorIcon />
        <p className="text-center">混ざり合った色</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <PrepareIcon />
        <p className="text-center">準備中</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AIIcon />
        <p className="text-center">AI</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <RSSIcon />
        <p className="text-center">RSS</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <GitHubIcon />
        <p className="text-center">GitHub</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <TwitterIcon />
        <p className="text-center">Twitter</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <QiitaIcon />
        <p className="text-center">Qiita</p>
      </div>
    </div>
  ),
  // lucide ラッパーだけでなく自前 SVG (GitHub / Qiita 等) も
  // renderItem の aria-hidden / focusable を svg まで伝播していることを網羅検証する
  play: async ({ canvasElement }) => {
    const svgs = [...canvasElement.querySelectorAll('svg')];
    await expect(svgs.length).toBeGreaterThan(0);
    await Promise.all(
      svgs.flatMap((svg) => [
        expect(svg).toHaveAttribute('aria-hidden', 'true'),
        expect(svg).toHaveAttribute('focusable', 'false'),
      ]),
    );
  },
};
