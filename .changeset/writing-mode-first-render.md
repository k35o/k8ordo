---
"@k8ordo/ui": patch
---

縦書きの中に置いた Autocomplete・Combobox・Tabs・Toolbar・ResizablePanels が、最初の描画から縦の向きで描かれるようにする。これまでは書字方向を ResizeObserver の最初の通知で知るまで横書きとして扱い、その間に開いた Autocomplete の一覧は入力欄の幅（縦書きでは高さを使うべきところ）に合わせていた。
