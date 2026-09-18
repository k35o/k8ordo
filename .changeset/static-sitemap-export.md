---
'@k8ordo/static': minor
---

`sitemap(site, pathnames)` の export をやめた。モードのパッケージの公開面はプラグインとその options に絞ってあり、どこからも import されていなかった。`sitemap.xml` は引き続き `site` オプションでビルドが書き出す。
