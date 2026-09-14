import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'k8ordo UIが提供するヘルパー関数の一覧です。',
  en: 'A catalog of helper functions provided by k8ordo UI.',
});

export const categoryStyling = message({
  ja: 'スタイリング',
  en: 'Styling',
});

export const categoryReact = message({
  ja: 'React',
  en: 'React',
});

export const common = {
  importTitle: message({
    ja: 'インポート',
    en: 'Import',
  }),
  usageTitle: message({
    ja: '使い方',
    en: 'Usage',
  }),
  basicUsageTitle: message({
    ja: '基本的な使い方',
    en: 'Basic Usage',
  }),
  parametersTitle: message({
    ja: 'パラメーター',
    en: 'Parameters',
  }),
  returnValueTitle: message({
    ja: '戻り値',
    en: 'Return Value',
  }),
};

export const cn = {
  description: message({
    ja: 'clsxとtailwind-mergeを組み合わせたクラス名ユーティリティ',
    en: 'A class name utility combining clsx and tailwind-merge.',
  }),
};

export const mergeRefs = {
  description: message({
    ja: '複数のrefを1つの要素に結合するユーティリティ',
    en: 'A utility that merges multiple refs into a single element.',
  }),
};

export const mergeProps = {
  description: message({
    ja: 'classNameやイベントハンドラを適切にマージして複数のpropsを合成するユーティリティ',
    en: 'A utility that merges multiple props together, properly combining className and event handlers.',
  }),
};

export const chain = {
  description: message({
    ja: '複数の関数を順番に呼び出す関数を作るユーティリティ',
    en: 'A utility that creates a function that calls multiple functions in order.',
  }),
};

export const createSafeContext = {
  description: message({
    ja: 'Provider外アクセス時に明確にthrowするContextを作るユーティリティ',
    en: 'A utility that creates a Context that throws clearly when accessed outside its Provider.',
  }),
};
