import generated from '@k8ordo/ui/props.json';

import { categoryTitles, pages } from './components-nav';
import type {
  ComponentCategory,
  ComponentGroups,
  ComponentNavName,
} from './components-nav';

// Imported only by Server Components: the file holds every component's props,
// and the client needs no more than the grouping below.

// A compound is listed by its parts (`Tabs.Root`), which share its folder.
const categoryOf = new Map(
  generated.components.map((component) => [
    component.name.split('.')[0],
    component.category,
  ]),
);

const isCategory = (category: string): category is ComponentCategory =>
  Object.hasOwn(categoryTitles, category);

const categorized = (Object.keys(pages) as ComponentNavName[]).map((name) => {
  const page = pages[name];
  const component = 'component' in page ? page.component : name;
  const category = categoryOf.get(component);
  if (category === undefined || !isCategory(category)) {
    throw new Error(
      `No category for the ${name} page (${component}: ${String(category)}). Run \`pnpm --filter @k8ordo/ui generate:props\`, or give the folder a title in categoryTitles.`,
    );
  }
  return { name, category };
});

export const componentGroups: ComponentGroups = (
  Object.keys(categoryTitles) as ComponentCategory[]
)
  .map((category) => ({
    category,
    names: categorized
      .filter((entry) => entry.category === category)
      .map((entry) => entry.name),
  }))
  .filter((group) => group.names.length > 0);
