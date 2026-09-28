import { Anchor, Carousel, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

const SeasonSlides = () =>
  SEASONS.map((season) => (
    <Carousel.Slide key={season} label={season}>
      <div className="bg-bg-base flex h-40 items-end rounded-xl p-6 shadow-sm">
        <p className="text-fg-base text-xl font-bold">{season}</p>
      </div>
    </Carousel.Slide>
  ));

export default function CarouselPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Carousel" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Carousel</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.carousel.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-carousel--default`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { Carousel } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.carousel.basicDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Carousel.Root label="Seasons">
  {seasons.map((season) => (
    <Carousel.Slide key={season} label={season}>
      <SeasonCard season={season} />
    </Carousel.Slide>
  ))}
</Carousel.Root>`}
          >
            <div className="w-full">
              <Carousel.Root label="Seasons">
                <SeasonSlides />
              </Carousel.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.carousel.slideSizeTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.carousel.slideSizeDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Carousel.Root label="Seasons" slideSize="md">
  …
</Carousel.Root>`}
          >
            <div className="w-full">
              <Carousel.Root label="Seasons" slideSize="md">
                <SeasonSlides />
              </Carousel.Root>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">Carousel.Root</Heading>
        <PropsTable
          inherits={inheritsOf('Carousel.Root')}
          items={propsOf('Carousel.Root')}
          messagesNote
        />
        <Heading level="h3">Carousel.Slide</Heading>
        <PropsTable
          inherits={inheritsOf('Carousel.Slide')}
          items={propsOf('Carousel.Slide')}
          messagesNote
        />
      </section>
    </div>
  );
}
