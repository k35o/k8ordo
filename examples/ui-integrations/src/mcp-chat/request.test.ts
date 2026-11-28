import { describe, expect, it } from 'vite-plus/test';

import { parseResourceRequest } from './request';

const sameOrigin = { origin: 'http://localhost:5173', host: 'localhost:5173' };

describe('parseResourceRequest', () => {
  it('ui:// のリソースだけを読ませる', () => {
    expect(
      parseResourceRequest(sameOrigin, { uri: 'ui://k8ordo/a2ui.html' }),
    ).toStrictEqual({ uri: 'ui://k8ordo/a2ui.html' });
    expect(
      parseResourceRequest(sameOrigin, { uri: 'file:///etc/passwd' }),
    ).toMatchObject({ status: 400 });
  });

  it('ほかのオリジンのページからの要求を断る', () => {
    expect(
      parseResourceRequest(
        { origin: 'https://example.com', host: 'localhost:5173' },
        { uri: 'ui://k8ordo/a2ui.html' },
      ),
    ).toMatchObject({ status: 403 });
  });
});
