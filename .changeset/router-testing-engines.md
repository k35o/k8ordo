---
"@k8ordo/router": patch
---

GUIDE の「Testing」を直す。パッケージ自身のテストは Chromium だけでなく Firefox と WebKit でも回っている。Vitest の browser mode はテストを iframe の中で動かし、Firefox と WebKit はそこで戻る・進むのスクロール位置を正しく戻さない（Firefox は戻る遷移の handler も 2 回走らせる）ので、戻る・進むはトップレベルのページで確かめる、と書き足す。
