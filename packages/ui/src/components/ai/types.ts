export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

export type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-error'
  | 'output-denied';

/**
 * AI SDK の `part.approval` と同じ形にして、パートのオブジェクトをそのまま渡せる
 * ようにしている。
 */
export type ToolApproval = {
  id: string;
  approved?: boolean;
  /** 許可・拒否した理由（答えの側） */
  reason?: string;
  /** 承認を求める理由（問いの側） */
  requestReason?: string;
  isAutomatic?: boolean;
};

export type ToolApprovalResponse = {
  id: string;
  approved: boolean;
};

export type MessageFeedback = 'positive' | 'negative';
