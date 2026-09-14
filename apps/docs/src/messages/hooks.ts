import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'k8ordo UIが提供するカスタムフックの一覧です。',
  en: 'A catalog of custom hooks provided by k8ordo UI.',
});

export const categoryDomInteraction = message({
  ja: 'DOM操作',
  en: 'DOM Interaction',
});

export const categoryStateStorage = message({
  ja: '状態・ストレージ',
  en: 'State & Storage',
});

export const categoryTiming = message({
  ja: 'タイミング',
  en: 'Timing',
});

export const categoryUtility = message({
  ja: 'ユーティリティ',
  en: 'Utility',
});

export const categoryObserver = message({
  ja: 'オブザーバー',
  en: 'Observer',
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

export const clickAway = {
  description: message({
    ja: '指定要素の外側のクリックを検出するフック',
    en: 'A hook that detects clicks outside a specified element.',
  }),
};

export const client = {
  description: message({
    ja: 'クライアントで実行中かどうかを返すフック',
    en: 'A hook that returns whether the code is running on the client.',
  }),
};

export const clipboard = {
  description: message({
    ja: 'クリップボードの読み書きを提供するフック',
    en: 'A hook that provides clipboard read/write operations.',
  }),
};

export const interval = {
  description: message({
    ja: '一定間隔でコールバックを実行するフック',
    en: 'A hook that executes a callback at regular intervals.',
  }),
};

export const resize = {
  description: message({
    ja: 'ResizeObserverで要素のサイズ変更を監視するフック',
    en: 'A hook that observes element size changes via ResizeObserver.',
  }),
};

export const scrollDirection = {
  description: message({
    ja: '現在のスクロール方向を検出するフック',
    en: 'A hook that detects the current scroll direction.',
  }),
  targetTitle: message({
    ja: '要素を指定する',
    en: 'Target element',
  }),
  bodyNotScrollableNote: message({
    ja: 'このページのbodyはスクロールしないため、ここでは動作を試せません。実際のスクロール可能なページでご確認ください。',
    en: "This page's body does not scroll, so the behavior can't be tried here. Please verify on an actual scrollable page.",
  }),
};

export const step = {
  description: message({
    ja: 'キーボード対応のステップナビゲーションフック',
    en: 'A hook for step-based navigation with keyboard support.',
  }),
};

export const timeout = {
  description: message({
    ja: '指定遅延後にコールバックを実行するフック',
    en: 'A hook that executes a callback after a specified delay.',
  }),
};

export const windowResize = {
  description: message({
    ja: 'ウィンドウのリサイズイベントを監視するフック',
    en: 'A hook that listens to window resize events.',
  }),
};

export const breakpoint = {
  description: message({
    ja: 'ビューポートが指定ブレイクポイントに一致するか判定するフック',
    en: 'A hook that checks whether the viewport matches a given breakpoint.',
  }),
};

export const debouncedTransition = {
  description: message({
    ja: 'delay経過後にstartTransitionでアクションを実行するフック',
    en: 'A hook that runs an action after a delay using startTransition and AbortController.',
  }),
};

export const deferredDebounce = {
  description: message({
    ja: 'useDeferredValueをラップし値とペンディング状態を返すフック',
    en: 'A hook that wraps useDeferredValue and returns the value together with a pending flag.',
  }),
};

export const disclosure = {
  description: message({
    ja: 'open・close・toggleで開閉状態を管理するフック',
    en: 'A hook for managing open/close state with open, close, and toggle actions.',
  }),
};

export const intersectionObserver = {
  description: message({
    ja: 'IntersectionObserverで要素の可視状態を監視するフック',
    en: 'A hook that observes element visibility via IntersectionObserver.',
  }),
};

export const inView = {
  description: message({
    ja: '要素がビューポート内に表示されているかを返すフック',
    en: 'A hook that returns whether an element is currently visible in the viewport.',
  }),
};

export const windowSize = {
  description: message({
    ja: '現在のウィンドウサイズを返すフック',
    en: 'A hook that returns the current window dimensions.',
  }),
};

export const scrollLock = {
  description: message({
    ja: 'bodyや指定要素のスクロールをロック・解除するフック',
    en: 'A hook that locks and unlocks scroll on the body or a specified element.',
  }),
  targetTitle: message({
    ja: '要素を指定する',
    en: 'Target element',
  }),
  bodyNotScrollableNote: message({
    ja: 'このページのbodyはスクロールしないため、ここでは動作を試せません。実際のスクロール可能なページでご確認ください。',
    en: "This page's body does not scroll, so the behavior can't be tried here. Please verify on an actual scrollable page.",
  }),
};

export const hover = {
  description: message({
    ja: '要素のホバー状態を検出するフック',
    en: 'A hook that detects hover state of an element.',
  }),
};

export const controllableState = {
  description: message({
    ja: 'controlled/uncontrolledの状態を管理するフック',
    en: 'A hook that manages controlled/uncontrolled component state.',
  }),
};

export const writingMode = {
  description: message({
    ja: '要素のwriting-modeを監視しhorizontal/verticalを返すフック',
    en: "A hook that observes an element's writing-mode and returns either horizontal or vertical.",
  }),
};
