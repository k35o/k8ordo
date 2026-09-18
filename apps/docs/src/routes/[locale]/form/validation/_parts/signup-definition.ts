import { defineForm, sameAs } from '@k8ordo/form/server';
import * as z from 'zod/mini';

import * as m from '../../../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが呼ぶ。文言はその描画の
// ロケールで引くので、モジュールスコープではなく描画のたびに組み立てる。
export const signupDefinition = () => {
  const password = z
    .string()
    .check(z.minLength(8, m.formValidation.demoPasswordTooShort()));
  z.globalRegistry.add(password, { input: 'password' });
  const confirm = z.string();
  z.globalRegistry.add(confirm, { input: 'password' });

  return defineForm(
    z.object({
      handle: z
        .string()
        .check(
          z.minLength(3, m.formValidation.demoHandleTooShort()),
          z.maxLength(20, m.formValidation.demoHandleTooLong()),
          z.regex(/^[a-z0-9_]+$/u, m.formValidation.demoHandlePattern()),
        ),
      password,
      confirm,
    }),
    [sameAs('confirm', 'password', m.formValidation.demoMismatch())],
  );
};
