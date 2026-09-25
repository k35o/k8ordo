import {
  Action,
  Actions,
  Content,
  Copy,
  Feedback,
  Regenerate,
  Root,
} from './message';

// RSC の server 環境では client モジュールの export は参照プロキシになり、
// オブジェクトごと export するとプロパティを引けないため、直接参照で合成する。
export const Message = {
  Root,
  Content,
  Actions,
  Action,
  Copy,
  Regenerate,
  Feedback,
} as const;
