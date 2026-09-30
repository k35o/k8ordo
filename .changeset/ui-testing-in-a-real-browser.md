---
'@k8ordo/ui': patch
---

コンポーネントのテストは実ブラウザ（Vitest の browser mode か Playwright）で書く前提であることを `docs/GUIDE.md` に明記した。`ResizeObserver` / `IntersectionObserver` / `matchMedia` / `dialog.showModal` / `close` / Popover API は support 判定を挟まず直接呼んでいるので、jsdom や happy-dom では `Tooltip` / `IconButton`（`tooltipDisabled` でないもの）/ `Tabs` / `Autocomplete` / `InView` / `Resize` / `Conversation` などは mount した時点で、`Modal` / `Drawer` / `Popover` / `DropdownMenu` / `ListBox` などは開いた時点で落ちる（一覧は GUIDE の Testing）。jsdom にはレイアウトエンジンが無く、スタブで塞いでも focus や配置や可視性のアサーションはほとんど意味を持たないため、塞ぐ方向には進まない。
