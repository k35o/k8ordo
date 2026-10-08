---
"@k8ordo/color-scheme": minor
---

`<ColorSchemeProvider>` に、インラインスクリプトへ付ける `nonce` を足し、そのスクリプトのハッシュを CSP のソース（`'sha256-…'`）として Promise で返す `colorSchemeScriptHash(defaultPreference?)` を足した。Content-Security-Policy の下で、nonce（`@k8ordo/framework/server` の `nonce()`）でもハッシュ（`@k8ordo/framework` の static モードの `csp`）でも許せる。
