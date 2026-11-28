---
'@k8ordo/ui': patch
---

AIチャットの参照に、MCP Appsの節を足しました。MCPサーバーのツールが持つApp（`ui://`のHTML）を、AI SDKの`MCPAppRenderer`でチャットの中に描く書き方です。あわせて、`examples/ui-integrations`の`mapMessageParts`がツールのpartそのものを`part`で持つようになったので、`MappedPart`の形にそれを足しました。
