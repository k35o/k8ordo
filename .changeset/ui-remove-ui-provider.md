---
'@k8ordo/ui': major
---

`UIProvider`をなくしました。中身は`ToastProvider`で包むだけで、ほかに何もしていませんでした。同じものに2つの名前があり、`UIProvider`という名前は何を持つかを表していませんでした。公開するproviderは`ToastProvider`だけです。`useToast`を使うアプリはルートを`ToastProvider`で1回だけ包み、トーストを出さないアプリにproviderは要りません。

`PortalRootProvider`と`usePortalRoot`もなくしました。ライブラリのオーバーレイはどれもトップレイヤーで開き、この値を読んでいませんでした。自分で浮かせるUIは`popover`属性を付けてその場に描きます。`Dialog`や`Drawer`の中で`document.body`へポータルするライブラリには、`ref`で受け取った`<dialog>`をポータル先として渡し、奥の部品で要るときは子の中に自分のContextを置きます。

移行するときは、`<UIProvider>`を`<ToastProvider>`に書き換えます。`UIProvider`と`ToastProvider`を重ねて包んでいたら、`ToastProvider`の1段だけにします。`usePortalRoot`でポータル先を受け取っていたところは、ダイアログの`ref`から受け取るように書き換えます。
