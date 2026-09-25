---
"@k8ordo/ui": major
---

AI チャットの部品に、ツールの承認・添付・出典・メッセージの操作を足しました。

- `ToolInvocation` が `approval` と `onApprovalResponse` を受け、`approval-requested` のあいだ折りたたみの外に「拒否」「許可」を出します。答えは `{ id, approved }` で届くので、AI SDK の `addToolApprovalResponse` をそのまま渡せます。自動の承認（`isAutomatic`）にはボタンを出しません。
- **破壊的変更**: `ToolInvocation` の `deniedReason` と、`mapMessageParts` が返す tool パートの `deniedReason` を消しました。拒否の理由は `approval.reason` から読みます。tool パートは `approval` をそのまま持つので、`approval={part.approval}` と渡してください。
- `mapMessageParts` が file・source（`source-url` / `source-document`）・data パーツも返すようになりました。
- `Attachment`（`List` / `Item`）と `Source`（`List` / `Item`）を足しました。`Source.Item` は http(s) の URL だけをリンクにします。
- `PromptInput.Root` に `accept` を渡すと、`PromptInput.Attach` の選択・ドロップ・貼り付けで添付を受け付けます（`maxFiles` で上限）。待機中の添付は `PromptInput.Attachments` に並び、`onSubmit` の第 2 引数に `FileList` で届きます。本文が空でも添付があれば送れます。
- **破壊的変更**: `Message.Root` が `avatar` を受け、子要素をアバターの隣に縦に積むようになりました。アバターを子として渡していた場合は `avatar` に移してください（子のままだと本文の上に積まれます）。
- `Message.Actions` と、その中に置く `Message.Copy` / `Message.Regenerate` / `Message.Feedback` / `Message.Action` を足しました。
- 型 `ToolApproval` / `ToolApprovalResponse` / `MessageFeedback` を `@k8ordo/ui/ai` から export します（前の 2 つは `@k8ordo/ui/ai-sdk` からも）。
- **破壊的変更**: 辞書（`Messages`）に文言を足しました。独自の辞書を渡している場合は `attach` / `attachments` / `attachmentRemove` / `attachmentImage` / `sources` / `messageActions` / `copy` / `copied` / `regenerate` / `feedbackPositive` / `feedbackNegative` / `toolApprovalRequest` / `toolApprove` / `toolDeny` を足してください。
