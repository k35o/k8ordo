---
'@k8ordo/i18n': patch
---

同梱ドキュメントの文言の例を、名前で import する形に揃えました。

- `import * as nav from '../messages/nav'` や `import * as m from '../messages'` をやめ、`import { home } from '../messages/nav'` のように使う文言だけを名前で import して `home()` と呼ぶ形にしました。文言を呼ぶ例には import の行を載せています。
- GUIDE の「Where messages live」で勧めていた、各ファイルを名前空間として再 export する `src/messages/index.ts` をやめました。領域ごとに 1 つのファイルを `src/messages/` に置き、名前で import する形を勧めます。2 つのファイルが同じ名前を export するときは、import で名前を付け替えます。
