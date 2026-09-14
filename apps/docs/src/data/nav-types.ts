import type { Message } from '@k8ordo/i18n';

export type NavItem = { name: string; path: string; description: Message };
export type NavCategory = { title: Message; items: NavItem[] };
