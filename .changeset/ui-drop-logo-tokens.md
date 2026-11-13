---
'@k8ordo/ui': major
---

トークンの`--color-logo-primary`と`--color-logo-secondary`を消しました。Tailwindの橋の`*-logo-primary`、`*-logo-secondary`と、`@k8ordo/ui/tokens`のDTCGの文書からも無くなります。ロゴを描く部品をuiが持たなくなったので、ロゴの色も使う側で持ちます。これまでの値は、ライトがteal-700とteal-600、ダークがteal-400とteal-500でした。
