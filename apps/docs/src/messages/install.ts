import { message } from '@k8ordo/i18n';

export const requirements = message({
  ja: '次の環境で動きます。',
  en: 'It runs with:',
});

export const react = message({
  ja: (version: string) => `React ${version}以上`,
  en: (version) => `React ${version} or later`,
});

export const vite = message({
  ja: (version: string) => `Vite ${version}以上`,
  en: (version) => `Vite ${version} or later`,
});

export const node = message({
  ja: (version: string) => `Node.js ${version}以上`,
  en: (version) => `Node.js ${version} or later`,
});

export const typescript = message({
  ja: (version: string) => `TypeScriptで書くなら、TypeScript ${version}以上`,
  en: (version) => `TypeScript ${version} or later, when you write TypeScript`,
});
