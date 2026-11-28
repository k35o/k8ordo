import type { TreeItem } from '../components/data-display/tree';
import type { TreeProps } from './schemas';

export const toTree = (items: TreeProps['items']): TreeItem[] => {
  const ids = new Set(items.map((item) => item.id));
  const build = (parentId: string | undefined): TreeItem[] =>
    items
      .filter((item) =>
        parentId === undefined
          ? item.parentId === undefined || !ids.has(item.parentId)
          : item.parentId === parentId,
      )
      .map((item): TreeItem => {
        const children = build(item.id);
        return children.length > 0
          ? { id: item.id, label: item.label, children }
          : { id: item.id, label: item.label };
      });
  return build(undefined);
};
