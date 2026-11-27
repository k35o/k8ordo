---
'@k8ordo/ui': patch
---

`CheckboxCard`と`Autocomplete`の`value`と`defaultValue`が、`readonly string[]`も受け取るようにしました。`as const`で書いた既定値や、ほかの部品から受け取った読み取り専用の配列を、写さずにそのまま渡せます。`onChange`にはこれまでどおり新しい`string[]`を渡すので、`useState<string[]>`のsetterをそのまま渡せます。受け取る配列は`readonly`、知らせる配列は新しい`string[]`という、ほかの部品と同じ決まりにそろえました。
