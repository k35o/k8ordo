# @k8ordo/color-scheme

## 1.0.0

### Major Changes

- 1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

  0.1.0 から上げるときに手を入れるもの: peer の `@k8ordo/state` を `^0.2.0` から `^1.0.0` にした。API と保存する行（localStorage の `k8ordo-state:color-scheme`）は変わらないので、訪問者が選んだ配色はそのまま読める。

  この版で足した主なもの: インラインスクリプトの `nonce` と、CSP のハッシュを返す `colorSchemeScriptHash()`。

### Minor Changes

- `<ColorSchemeProvider>` に、インラインスクリプトへ付ける `nonce` を足し、そのスクリプトのハッシュを CSP のソース（`'sha256-…'`）として Promise で返す `colorSchemeScriptHash(defaultPreference?)` を足した。Content-Security-Policy の下で、nonce（`@k8ordo/server` の `nonce()`）でもハッシュ（`@k8ordo/static` の `csp`）でも許せる。

### Patch Changes

- ドキュメントを厚くしました。

  - docs サイトの `/color-scheme` に、スタイル（`dark` クラス、@k8ordo/ui との関係、CSS の `color-scheme` プロパティ、高コントラストは OS の設定に従うこと）、保存（@k8ordo/state のローカル状態としての行、hook を通さずに読む方法、タブ間の同期）、CSP（nonce とハッシュで許す方法、許さないと何が起きるか）のページを足しました。入門と仕組みのページからは、それぞれへ移した節を外しています。
  - 仕組みのページに残っていた「Provider は `nonce` を受け取らない」という記述と、型の例に無かった `nonce` を、今の実装に合わせました。
  - 同梱の `GUIDE.md` に、コントラストを持たないこと、スクリプトがブロックされたときに起きること、保存される行の形を書き足しました。

- 同梱ドキュメントを実装に追従させました。

  - Tailwind CSS 4 の既定の `dark:` はメディアクエリで、`<html>` の `dark` クラスを読むのは `@k8ordo/ui` の dark variant（Tailwind を直接使うなら `@custom-variant` の宣言が要る）だと直しました。
  - 既定の `'system'` のとき、サーバーはシステムの設定を知らないので `scheme` を `'light'` で描く、と書きました。
  - `setPreference('system')` は保存行を消すのではなく preference を外すこと、クライアントだけでマウントしたときはインラインスクリプトが実行されないことを書きました。
  - CSS の `color-scheme` プロパティ（フォーム部品やスクロールバー）はこのパッケージが設定せず、`@k8ordo/ui` のスタイルシートがトークンと一緒に設定する、と書きました。
  - README の peer 表に optional peer の `@types/react` を足しました。

- README の「AI Agent Documentation」節を他のパッケージに揃えました。エージェントの `CLAUDE.md` / `AGENTS.md` に貼るスニペットと、同梱ドキュメント・サイトの `llms.txt`・web 上の markdown twin の表を足し、License 節に LICENSE へのリンクを書いています。

- Updated dependencies:
  - @k8ordo/state@1.0.0
