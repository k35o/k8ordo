import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

import { jsonRenderSpec } from './demo';

test('デモの spec は現行スキーマで検証を通り、自動修正も要らない', () => {
  // `satisfies UISpec` が見るのは型だけ。旧 API のキーや enum 外の値は
  // validateGeneratedSpec でしか落ちないので、デモも LLM 出力と同じ経路に通す。
  // 失敗時に issues がそのまま diff に出るよう、ok の真偽ではなく戻り値を照合する。
  expect(validateGeneratedSpec(jsonRenderSpec)).toMatchObject({
    fixes: [],
    ok: true,
  });
});
