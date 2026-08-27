export { UIProvider } from './ui-provider';
// UIProvider の messages prop の型。辞書本体（ja / en）は
// バンドルに載せないため @k8ordo/ui/i18n からのみ export する
export type { Messages } from '../../i18n/messages';
export { PortalRootProvider, usePortalRoot } from './portal-root';
