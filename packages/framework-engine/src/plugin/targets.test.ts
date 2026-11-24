import { describe, expect, it } from 'vite-plus/test';

import { targetsOf } from './targets';

const compatibleVersions = [
  { browser: 'chrome', version: '153' },
  { browser: 'chrome_android', version: '153' },
  { browser: 'edge', version: '153' },
  { browser: 'firefox', version: '159' },
  { browser: 'firefox_android', version: '159' },
  { browser: 'safari', version: '17.5' },
  { browser: 'safari_ios', version: '17.5' },
];

describe('targetsOf', () => {
  it("names the browsers as Vite's build target takes them", () => {
    expect(targetsOf(compatibleVersions).build).toStrictEqual([
      'chrome153',
      'edge153',
      'firefox159',
      'safari17.5',
      'ios17.5',
    ]);
  });

  it("names the browsers and encodes the versions as Lightning CSS's targets take them", () => {
    expect(targetsOf(compatibleVersions).lightningcss).toStrictEqual({
      chrome: 10_027_008,
      edge: 10_027_008,
      firefox: 10_420_224,
      safari: 1_115_392,
      ios_saf: 1_115_392,
    });
  });
});
