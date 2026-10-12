---
'docs': patch
---

form と ui のコード例で、文言を `import { titleMissing } from '../messages/talk'` のように名前で import して呼ぶ形にそろえ、import の行も見せるようにした。apps/docs/CLAUDE.md のコード例の決まりも、名前で import する形に書き換えた（名前空間や `index.ts` のまとめファイルは使わない）。
