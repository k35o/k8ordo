import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

import { formFields } from './derive/form-fields';
import { parseForm } from './parse/parse-form';

// @k8ordo/state の GUIDE にある定義そのもの。GET フォームの節は
// `formFields(listState.url)` と書き、1 つのスキーマで両方をまかなう。
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const listState = definePageState('product-list', {
  url: z.object({
    q: z._default(z.string(), ''),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
    inStock: z._default(z.stringbool(), false),
  }),
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
  }),
});

const spelled = definePageState('spelled', {
  url: z.object({
    gift: z._default(z.stringbool({ truthy: ['yes'], falsy: ['no'] }), false),
  }),
});
/* oxlint-enable no-underscore-dangle */

/** What a GET form puts in the URL: every entry, as a query string. */
const submitted = (query: string): FormData => {
  const formData = new FormData();
  for (const [key, value] of new URLSearchParams(query)) {
    formData.append(key, value);
  }
  return formData;
};

describe('a GET form over a @k8ordo/state url schema', () => {
  it('derives a form from the url schema, a stringbool field included', () => {
    const { fields } = formFields(listState.url);

    expect(fields.inStock.input).toStrictEqual({
      name: 'inStock',
      type: 'checkbox',
      value: 'true',
    });
  });

  it('submits a checked box as the string state writes for true', () => {
    expect(listState.search({ inStock: true })).toBe(
      `inStock=${String(formFields(listState.url).fields.inStock.input.value)}`,
    );
    expect(spelled.search({ gift: true })).toBe(
      `gift=${String(formFields(spelled.url).fields.gift.input.value)}`,
    );
  });

  it('reads a submission the way state reads the URL the form wrote', () => {
    // 数値欄は空のまま送ると `page=` になる。どちらも未入力として既定値に落とす
    for (const query of ['q=shoes&page=&inStock=true', 'q=&page=2']) {
      expect(parseForm(listState.url, submitted(query)).data).toStrictEqual(
        listState.parseUrl(new URLSearchParams(query)),
      );
    }
  });
});
