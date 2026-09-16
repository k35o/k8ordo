---
'@k8ordo/ui': patch
---

コンポーネントのテストは実ブラウザ（Vitest の browser mode か Playwright）で書く前提であることを `docs/GUIDE.md` に明記した。`ResizeObserver` / `IntersectionObserver` / `matchMedia` / `dialog.showModal` / `close` / Popover API は support 判定を挟まず直接呼んでいるので、jsdom や happy-dom で `Modal` / `Drawer` / `Popover` / `Tooltip` / `DropdownMenu` / `Conversation` を mount すると落ちる。jsdom にはレイアウトエンジンが無く、スタブで塞いでも focus や配置や可視性のアサーションはほとんど意味を持たないため、塞ぐ方向には進まない。
