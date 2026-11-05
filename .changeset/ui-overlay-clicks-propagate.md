---
"@k8ordo/ui": patch
---

`Dialog.Content`・`Dialog.Header`の閉じるボタン・`Drawer`の中身と閉じるボタンで、クリックの伝わりを止めないようにしました。中のクリックが祖先の`onClick`や`document`のリスナーに届きます。モーダルが閉じるのはこれまでどおり枠外（`<dialog>`自身）を押したときだけです。
