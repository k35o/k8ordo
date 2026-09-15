// 文言は名前空間ごとのモジュールに置き、ここで束ねる。使う側は
// `import * as m from '../messages'` の上で `m.nav.home()` と呼ぶ。バンドラは
// 呼ばれた文言だけを残す（message() は宣言時に副作用を持たない）。
export * as nav from './nav';
export * as home from './home';
export * as ui from './ui';
export * as common from './common';
export * as footer from './footer';
export * as form from './form';
export * as state from './state';
export * as router from './router';
//  は予約語なので、名前空間だけ文字列名で出す（ES2022）
export * as 'static' from './static';
export * as server from './server';
export * as i18n from './i18n';
export * as colorScheme from './color-scheme';
export * as ai from './ai';
export * as aiAgents from './ai-agents';
export * as generativeUi from './generative-ui';
export * as aiChat from './ai-chat';
export * as getStarted from './get-started';
export * as catalog from './catalog';
export * as components from './components';
export * as hooks from './hooks';
export * as helpers from './helpers';
export * as theming from './theming';
export * as uiI18n from './ui-i18n';
export * as sideNav from './side-nav';
export * as notFound from './not-found';
export * as error from './error';
