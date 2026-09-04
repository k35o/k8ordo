import {
  AIIcon,
  AccessibilityIcon,
  AlertIcon,
  Anchor,
  AtomIcon,
  BadIcon,
  BlogIcon,
  BoringIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  ColorContrastIcon,
  ColorInfoIcon,
  ColorScaleIcon,
  CopyIcon,
  DarkModeIcon,
  DifficultIcon,
  EasyIcon,
  ExternalLinkIcon,
  FormIcon,
  GitHubIcon,
  GoodIcon,
  Heading,
  HistoryIcon,
  InformativeIcon,
  InterestingIcon,
  LightModeIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  LogoIcon,
  MailIcon,
  MinusIcon,
  MixedColorIcon,
  NavigationMenuIcon,
  NewsIcon,
  PaletteIcon,
  PlusIcon,
  PrepareIcon,
  PublishDateIcon,
  QiitaIcon,
  RefreshIcon,
  RSSIcon,
  SendIcon,
  Separator,
  ShallowIcon,
  ShieldCheckIcon,
  SlideIcon,
  SparklesIcon,
  SubscribeIcon,
  TableIcon,
  TagIcon,
  TwitterIcon,
  UpdateDateIcon,
  ViewIcon,
  ViewOffIcon,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';

const IconCard = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => (
  <div className="border-border-base flex flex-col items-center justify-center gap-2 rounded-lg border p-4">
    {children}
    <p className="text-fg-mute text-xs">{name}</p>
  </div>
);

export default function IconsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Icons</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.icons.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-icons--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { CloseIcon, CheckIcon } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.icons.sizesTitle" />
        </Heading>
        <div className="flex flex-wrap items-end gap-6">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map(
            (size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <CheckIcon size={size} />
                <p className="text-fg-mute text-sm">{size}</p>
              </div>
            ),
          )}
        </div>
        <CodeBlock
          code={`<CheckIcon size="xs" />  {/* 12px */}
<CheckIcon size="sm" />  {/* 16px */}
<CheckIcon size="md" />  {/* 24px (default) */}
<CheckIcon size="lg" />  {/* 32px */}
<CheckIcon size="xl" />  {/* 40px */}
<CheckIcon size="2xl" /> {/* 48px */}
<CheckIcon size="3xl" /> {/* 56px */}`}
          lang="tsx"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.usageTitle" />
        </Heading>
        <div className="grid-cols-auto-fit-28 grid gap-4">
          <IconCard name="LogoIcon">
            <LogoIcon />
          </IconCard>
          <IconCard name="CloseIcon">
            <CloseIcon />
          </IconCard>
          <IconCard name="CheckIcon">
            <CheckIcon />
          </IconCard>
          <IconCard name="ChevronIcon">
            <ChevronIcon direction="down" />
          </IconCard>
          <IconCard name="PlusIcon">
            <PlusIcon />
          </IconCard>
          <IconCard name="MinusIcon">
            <MinusIcon />
          </IconCard>
          <IconCard name="LinkIcon">
            <LinkIcon />
          </IconCard>
          <IconCard name="ExternalLinkIcon">
            <ExternalLinkIcon />
          </IconCard>
          <IconCard name="CopyIcon">
            <CopyIcon />
          </IconCard>
          <IconCard name="SendIcon">
            <SendIcon />
          </IconCard>
          <IconCard name="MailIcon">
            <MailIcon />
          </IconCard>
          <IconCard name="ViewIcon">
            <ViewIcon />
          </IconCard>
          <IconCard name="ViewOffIcon">
            <ViewOffIcon />
          </IconCard>
          <IconCard name="AlertIcon (info)">
            <AlertIcon status="info" />
          </IconCard>
          <IconCard name="AlertIcon (success)">
            <AlertIcon status="success" />
          </IconCard>
          <IconCard name="AlertIcon (warning)">
            <AlertIcon status="warning" />
          </IconCard>
          <IconCard name="AlertIcon (error)">
            <AlertIcon status="error" />
          </IconCard>
          <IconCard name="AccessibilityIcon">
            <AccessibilityIcon />
          </IconCard>
          <IconCard name="AIIcon">
            <AIIcon />
          </IconCard>
          <IconCard name="AtomIcon">
            <AtomIcon />
          </IconCard>
          <IconCard name="BlogIcon">
            <BlogIcon />
          </IconCard>
          <IconCard name="ColorContrastIcon">
            <ColorContrastIcon />
          </IconCard>
          <IconCard name="ColorInfoIcon">
            <ColorInfoIcon />
          </IconCard>
          <IconCard name="ColorScaleIcon">
            <ColorScaleIcon />
          </IconCard>
          <IconCard name="DarkModeIcon">
            <DarkModeIcon />
          </IconCard>
          <IconCard name="LightModeIcon">
            <LightModeIcon />
          </IconCard>
          <IconCard name="FormIcon">
            <FormIcon />
          </IconCard>
          <IconCard name="HistoryIcon">
            <HistoryIcon />
          </IconCard>
          <IconCard name="RefreshIcon">
            <RefreshIcon />
          </IconCard>
          <IconCard name="ListIcon">
            <ListIcon />
          </IconCard>
          <IconCard name="LocationIcon">
            <LocationIcon />
          </IconCard>
          <IconCard name="MixedColorIcon">
            <MixedColorIcon />
          </IconCard>
          <IconCard name="NavigationMenuIcon">
            <NavigationMenuIcon />
          </IconCard>
          <IconCard name="NewsIcon">
            <NewsIcon />
          </IconCard>
          <IconCard name="PaletteIcon">
            <PaletteIcon />
          </IconCard>
          <IconCard name="PrepareIcon">
            <PrepareIcon />
          </IconCard>
          <IconCard name="PublishDateIcon">
            <PublishDateIcon />
          </IconCard>
          <IconCard name="RSSIcon">
            <RSSIcon />
          </IconCard>
          <IconCard name="ShieldCheckIcon">
            <ShieldCheckIcon />
          </IconCard>
          <IconCard name="SlideIcon">
            <SlideIcon />
          </IconCard>
          <IconCard name="SparklesIcon">
            <SparklesIcon />
          </IconCard>
          <IconCard name="SubscribeIcon">
            <SubscribeIcon />
          </IconCard>
          <IconCard name="TableIcon">
            <TableIcon />
          </IconCard>
          <IconCard name="TagIcon">
            <TagIcon />
          </IconCard>
          <IconCard name="UpdateDateIcon">
            <UpdateDateIcon />
          </IconCard>
          <IconCard name="GoodIcon">
            <GoodIcon />
          </IconCard>
          <IconCard name="BadIcon">
            <BadIcon />
          </IconCard>
          <IconCard name="InformativeIcon">
            <InformativeIcon />
          </IconCard>
          <IconCard name="ShallowIcon">
            <ShallowIcon />
          </IconCard>
          <IconCard name="InterestingIcon">
            <InterestingIcon />
          </IconCard>
          <IconCard name="BoringIcon">
            <BoringIcon />
          </IconCard>
          <IconCard name="EasyIcon">
            <EasyIcon />
          </IconCard>
          <IconCard name="DifficultIcon">
            <DifficultIcon />
          </IconCard>
          <IconCard name="GitHubIcon">
            <GitHubIcon />
          </IconCard>
          <IconCard name="TwitterIcon">
            <TwitterIcon />
          </IconCard>
          <IconCard name="QiitaIcon">
            <QiitaIcon />
          </IconCard>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <p className="text-fg-mute text-sm">
          <T k="components.icons.propsDescription" />
        </p>
        <PropsTable items={propsOf('CheckIcon')} />
        <Heading level="h3">ChevronIcon</Heading>
        <PropsTable items={propsOf('ChevronIcon')} />
        <Heading level="h3">AlertIcon</Heading>
        <PropsTable items={propsOf('AlertIcon')} />
      </section>
    </div>
  );
}
