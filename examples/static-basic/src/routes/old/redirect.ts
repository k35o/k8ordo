import type { RedirectTarget } from '@k8ordo/framework/server';

// この URL は products へ移った。文字列か { to, permanent } を default export する
export default '/products' satisfies RedirectTarget;
