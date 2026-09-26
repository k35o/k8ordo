import { Attach, Attachments, Root, Submit, Textarea } from './prompt-input';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const PromptInput = {
  Root,
  Attachments,
  Attach,
  Textarea,
  Submit,
} as const;
