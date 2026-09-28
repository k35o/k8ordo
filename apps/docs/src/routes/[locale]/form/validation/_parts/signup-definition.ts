import { defineForm, sameAs } from '@k8ordo/form/server';
import * as z from 'zod/mini';

import * as m from '../../../../../messages';

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
const password = z
  .string()
  .check(z.minLength(8, { error: m.formValidation.demoPasswordTooShort }));
z.globalRegistry.add(password, { input: 'password' });
const confirm = z.string();
z.globalRegistry.add(confirm, { input: 'password' });

export const signupDefinition = defineForm(
  z.object({
    handle: z
      .string()
      .check(
        z.minLength(3, { error: m.formValidation.demoHandleTooShort }),
        z.maxLength(20, { error: m.formValidation.demoHandleTooLong }),
        z.regex(/^[a-z0-9_]+$/u, { error: m.formValidation.demoHandlePattern }),
      ),
    password,
    confirm,
  }),
  [sameAs('confirm', 'password', m.formValidation.demoMismatch)],
);
