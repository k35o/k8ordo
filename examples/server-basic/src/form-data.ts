// 属性値の中で React がエスケープした文字を戻す。useActionState が仕込む
// hidden input の値は JSON なので、&quot; を戻さないと action が復号できない
const unescapeAttribute = (value: string): string =>
  value
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

// SSR した HTML の中の <form> を、ブラウザが送るのと同じ FormData にする
export const formDataOf = (html: string, testId: string): FormData => {
  const form =
    new RegExp(`<form[^>]*data-testid="${testId}"[\\s\\S]*?</form>`, 'u').exec(
      html,
    )?.[0] ?? '';
  const body = new FormData();
  for (const input of form.matchAll(/<input[^>]*>/gu)) {
    const name = /name="([^"]+)"/u.exec(input[0])?.[1];
    const value = /value="([^"]*)"/u.exec(input[0])?.[1] ?? '';
    if (name !== undefined) body.set(name, unescapeAttribute(value));
  }
  return body;
};
