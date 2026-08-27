// lucide-react の個別アイコンファイル（dist/esm/icons/*.mjs）には型宣言が無いため、
// deep import に型を与える。実体は LucideIcon（forwardRef コンポーネント）。
// バレル import を避けて Vite dev の事前バンドル不具合（named export の undefined 化）を回避する。
declare module 'lucide-react/dist/esm/icons/*' {
  import type { LucideIcon } from 'lucide-react';

  const icon: LucideIcon;
  export default icon;
}
