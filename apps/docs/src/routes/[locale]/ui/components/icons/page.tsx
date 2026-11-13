import { Anchor, Heading, Separator } from '@k8ordo/ui';
import * as icons from '@k8ordo/ui/icons';
import type { ReactNode } from 'react';

import { CodeBlock } from '../../../../../components/code-block';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/icons.module.css';

const { AlertIcon, BaseIcon, ChevronIcon, ...shapes } = icons;
const { CheckIcon } = shapes;

const IconCard = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => (
  <div className={styles.card}>
    {children}
    <p className={styles.name}>{name}</p>
  </div>
);

export default function IconsPage() {
  return (
    <div className={page.page}>
      <PageTitle name="Icons" />
      <div className={page.stack}>
        <Heading level="h1">Icons</Heading>
        <p className={page.lead}>
          <Rich>{m.components.icons.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-icons--sizes`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { CheckIcon, XIcon } from '@k8ordo/ui/icons';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.icons.sizesTitle()}</Rich>
        </Heading>
        <div className={styles.sizes}>
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map(
            (size) => (
              <div key={size} className={styles.size}>
                <CheckIcon size={size} />
                <p className={styles.note}>{size}</p>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.usageTitle()}</Rich>
        </Heading>
        <div className={styles.grid}>
          {Object.entries(shapes).map(([name, Icon]) => (
            <IconCard key={name} name={name}>
              <Icon />
            </IconCard>
          ))}
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.icons.ownTitle()}</Rich>
        </Heading>
        <p>
          <Rich>{m.components.icons.ownDescription()}</Rich>
        </p>
        <div className={styles.sizes}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <BaseIcon
              key={size}
              renderItem={(props) => (
                <svg {...props} fill="currentColor" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="5" />
                </svg>
              )}
              size={size}
            />
          ))}
        </div>
        <CodeBlock
          code={`import { BaseIcon } from '@k8ordo/ui/icons';
import type { BaseIconProps } from '@k8ordo/ui/icons';

export const DotIcon = ({ size = 'md' }: Partial<BaseIconProps>) => (
  <BaseIcon
    renderItem={(props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="5" />
      </svg>
    )}
    size={size}
  />
);`}
          lang="tsx"
        />
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <p className={styles.note}>
          <Rich>{m.components.icons.propsDescription()}</Rich>
        </p>
        <PropsTable items={propsOf('CheckIcon')} />
        <Heading level="h3">ChevronIcon</Heading>
        <div className={styles.sizes}>
          <ChevronIcon direction="up" />
          <ChevronIcon direction="down" />
          <ChevronIcon direction="left" />
          <ChevronIcon direction="right" />
        </div>
        <PropsTable items={propsOf('ChevronIcon')} />
        <Heading level="h3">AlertIcon</Heading>
        <div className={styles.sizes}>
          <AlertIcon status="success" />
          <AlertIcon status="info" />
          <AlertIcon status="warning" />
          <AlertIcon status="error" />
        </div>
        <PropsTable items={propsOf('AlertIcon')} />
        <Heading level="h3">BaseIcon</Heading>
        <PropsTable items={propsOf('BaseIcon')} />
      </section>
    </div>
  );
}
