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

import styles from './icons.stories.module.css';

const meta: Meta<typeof SVGAElement> = {
  title: 'components/icons',
};

export default meta;
type Story = StoryObj<FC>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

export const Sizes: Story = {
  render: () => (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.size}>
          <CheckIcon size={size} />
          <p className={styles.sizeLabel}>{size}</p>
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
    <div className={styles.gallery}>
      <div className={styles.icon}>
        <LogoIcon />
        <p className={styles.name}>Logo</p>
      </div>
      <div className={styles.icon}>
        <CloseIcon />
        <p className={styles.name}>Close</p>
      </div>
      <div className={styles.icon}>
        <CodeXmlIcon />
        <p className={styles.name}>CodeXml</p>
      </div>
      <div className={styles.icon}>
        <ChevronIcon direction="left" />
        <p className={styles.name}>Chevron Left</p>
      </div>
      <div className={styles.icon}>
        <ChevronIcon direction="up" />
        <p className={styles.name}>Chevron Up</p>
      </div>
      <div className={styles.icon}>
        <ChevronIcon direction="right" />
        <p className={styles.name}>Chevron Right</p>
      </div>
      <div className={styles.icon}>
        <ChevronIcon direction="down" />
        <p className={styles.name}>Chevron Down</p>
      </div>
      <div className={styles.icon}>
        <CheckIcon />
        <p className={styles.name}>Check</p>
      </div>
      <div className={styles.icon}>
        <AlertIcon status="info" />
        <p className={styles.name}>Info</p>
      </div>
      <div className={styles.icon}>
        <AlertIcon status="success" />
        <p className={styles.name}>Success</p>
      </div>
      <div className={styles.icon}>
        <AlertIcon status="warning" />
        <p className={styles.name}>Warning</p>
      </div>
      <div className={styles.icon}>
        <AlertIcon status="error" />
        <p className={styles.name}>Error</p>
      </div>
      <div className={styles.icon}>
        <LinkIcon />
        <p className={styles.name}>Link</p>
      </div>
      <div className={styles.icon}>
        <ExternalLinkIcon />
        <p className={styles.name}>External Link</p>
      </div>
      <div className={styles.icon}>
        <BlogIcon />
        <p className={styles.name}>Blog</p>
      </div>
      <div className={styles.icon}>
        <HorizontalWritingIcon />
        <p className={styles.name}>横書き</p>
      </div>
      <div className={styles.icon}>
        <VerticalWritingIcon />
        <p className={styles.name}>縦書き</p>
      </div>
      <div className={styles.icon}>
        <SlideIcon />
        <p className={styles.name}>Slide</p>
      </div>
      <div className={styles.icon}>
        <TagIcon />
        <p className={styles.name}>Tag</p>
      </div>
      <div className={styles.icon}>
        <LocationIcon />
        <p className={styles.name}>Location</p>
      </div>
      <div className={styles.icon}>
        <FormIcon />
        <p className={styles.name}>Form</p>
      </div>
      <div className={styles.icon}>
        <TableIcon />
        <p className={styles.name}>Table</p>
      </div>
      <div className={styles.icon}>
        <ListIcon />
        <p className={styles.name}>List</p>
      </div>
      <div className={styles.icon}>
        <SquircleIcon />
        <p className={styles.name}>Squircle</p>
      </div>
      <div className={styles.icon}>
        <FlaskIcon />
        <p className={styles.name}>Flask</p>
      </div>
      <div className={styles.icon}>
        <PackageIcon />
        <p className={styles.name}>Package</p>
      </div>
      <div className={styles.icon}>
        <NavigationMenuIcon />
        <p className={styles.name}>Navigation Menu</p>
      </div>
      <div className={styles.icon}>
        <CopyIcon />
        <p className={styles.name}>Copy</p>
      </div>
      <div className={styles.icon}>
        <PublishDateIcon />
        <p className={styles.name}>公開日時</p>
      </div>
      <div className={styles.icon}>
        <UpdateDateIcon />
        <p className={styles.name}>更新日時</p>
      </div>
      <div className={styles.icon}>
        <SendIcon />
        <p className={styles.name}>送信</p>
      </div>
      <div className={styles.icon}>
        <HistoryIcon />
        <p className={styles.name}>履歴</p>
      </div>
      <div className={styles.icon}>
        <RefreshIcon />
        <p className={styles.name}>再読み込み</p>
      </div>
      <div className={styles.icon}>
        <MailIcon />
        <p className={styles.name}>メール</p>
      </div>
      <div className={styles.icon}>
        <PlusIcon />
        <p className={styles.name}>プラス</p>
      </div>
      <div className={styles.icon}>
        <MinusIcon />
        <p className={styles.name}>マイナス</p>
      </div>
      <div className={styles.icon}>
        <GoodIcon />
        <p className={styles.name}>良い</p>
      </div>
      <div className={styles.icon}>
        <BadIcon />
        <p className={styles.name}>悪い</p>
      </div>
      <div className={styles.icon}>
        <InformativeIcon />
        <p className={styles.name}>有益</p>
      </div>
      <div className={styles.icon}>
        <ShallowIcon />
        <p className={styles.name}>浅い</p>
      </div>
      <div className={styles.icon}>
        <InterestingIcon />
        <p className={styles.name}>面白い</p>
      </div>
      <div className={styles.icon}>
        <BoringIcon />
        <p className={styles.name}>退屈</p>
      </div>
      <div className={styles.icon}>
        <EasyIcon />
        <p className={styles.name}>簡単</p>
      </div>
      <div className={styles.icon}>
        <DifficultIcon />
        <p className={styles.name}>難解</p>
      </div>
      <div className={styles.icon}>
        <LightModeIcon />
        <p className={styles.name}>ライトモード</p>
      </div>
      <div className={styles.icon}>
        <DarkModeIcon />
        <p className={styles.name}>ダークモード</p>
      </div>
      <div className={styles.icon}>
        <ViewIcon />
        <p className={styles.name}>閲覧数</p>
      </div>
      <div className={styles.icon}>
        <NewsIcon />
        <p className={styles.name}>お知らせ</p>
      </div>
      <div className={styles.icon}>
        <SubscribeIcon />
        <p className={styles.name}>メールの購読</p>
      </div>
      <div className={styles.icon}>
        <ColorInfoIcon />
        <p className={styles.name}>色についての情報</p>
      </div>
      <div className={styles.icon}>
        <ColorContrastIcon />
        <p className={styles.name}>コントラスト</p>
      </div>
      <div className={styles.icon}>
        <ColorScaleIcon />
        <p className={styles.name}>色の段階</p>
      </div>
      <div className={styles.icon}>
        <MixedColorIcon />
        <p className={styles.name}>混ざり合った色</p>
      </div>
      <div className={styles.icon}>
        <PrepareIcon />
        <p className={styles.name}>準備中</p>
      </div>
      <div className={styles.icon}>
        <AIIcon />
        <p className={styles.name}>AI</p>
      </div>
      <div className={styles.icon}>
        <RSSIcon />
        <p className={styles.name}>RSS</p>
      </div>
      <div className={styles.icon}>
        <GitHubIcon />
        <p className={styles.name}>GitHub</p>
      </div>
      <div className={styles.icon}>
        <TwitterIcon />
        <p className={styles.name}>Twitter</p>
      </div>
      <div className={styles.icon}>
        <QiitaIcon />
        <p className={styles.name}>Qiita</p>
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
