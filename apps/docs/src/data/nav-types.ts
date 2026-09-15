import type { Message } from '@k8ordo/i18n';

import type { SitePath } from '../links';

export type NavItem = { name: string; path: SitePath; description: Message };
export type NavCategory = { title: Message; items: NavItem[] };
