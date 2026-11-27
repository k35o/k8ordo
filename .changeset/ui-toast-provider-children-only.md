---
'@k8ordo/ui': major
---

`ToastProvider`の公開のpropsを`children`だけにし、`portalRef`と`position`をなくしました。使っていたのは、自分の`<dialog>`の中にトーストを出す`Dialog`と`Drawer`の内部だけでした。`Dialog`と`Drawer`の中の`useToast`は、これまでどおりトーストをその`<dialog>`の中に出し、閉じると一緒に消えます。`portalRef`や`position`を渡していたら消してください。
