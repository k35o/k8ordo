---
'@k8ordo/ui': major
---

`Button`の`isActive`をなくしました。文字色を変えるだけで、支援技術には伝わっていませんでした。

代わりに、`variant="skeleton"`の`Button`は、`aria-pressed`を渡したトグルと、`aria-current`を渡した今のページへのリンクを、infoの文字色で描きます。状態はARIAの属性にあるので、色で見えるものがスクリーンリーダーにも伝わります。

`Toolbar`の中では、押した項目をツールバーが濃い地で示し、文字はその地と対になる`fg-base`で描きます。スケルトンの`Button`もinfoの文字色にはなりません。無効な項目は無効の見た目のままです。これまで、ツールバーの中で押したスケルトンのトグルは、ダークでは文字と地のコントラストが足りませんでした。

文字色で状態を示すのはスケルトンだけです。`solid`と`outline`のトグルは、押した状態の見た目を持たないので、`variant`や`color`を状態で切り替えてください。

移行するときは、`isActive={x}`を`aria-pressed={x}`か、リンクなら`aria-current={x ? 'page' : undefined}`にします。`solid`や`outline`の`Button`で`isActive`を使っていたところは、`variant`や`color`を状態で切り替えます。
