import { getCompatibleVersions } from 'baseline-browser-mapping';

/** The browsers a build is aimed at, in the two forms Vite takes them. */
export type Targets = {
  /** `build.target` and `build.cssTarget`: esbuild's names. */
  readonly build: string[];
  /** `css.lightningcss.targets`: Lightning CSS's names and version encoding. */
  readonly lightningcss: Record<string, number>;
};

// Android の Chrome と Firefox は渡さない。esbuild には名前が無く、Lightning
// CSS の android は WebView のことで、版はどちらもデスクトップと同じ
const NAMES: Readonly<
  Record<string, readonly [build: string, lightningcss: string]>
> = {
  chrome: ['chrome', 'chrome'],
  edge: ['edge', 'edge'],
  firefox: ['firefox', 'firefox'],
  safari: ['safari', 'safari'],
  safari_ios: ['ios', 'ios_saf'],
};

/** `versions`, as baseline-browser-mapping lists them, in Vite's two forms. */
export const targetsOf = (
  versions: ReadonlyArray<{ browser: string; version: string }>,
): Targets => {
  const build: string[] = [];
  const lightningcss: Record<string, number> = {};
  for (const { browser, version } of versions) {
    const names = NAMES[browser];
    if (names === undefined) continue;
    const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);
    build.push(`${names[0]}${version}`);
    lightningcss[names[1]] = (major << 16) | (minor << 8) | patch;
  }
  return { build, lightningcss };
};

/**
 * The browsers that ship every feature Baseline has newly available: the
 * ones the family is written for.
 */
export const newlyAvailableTargets = (): Targets => {
  // 今 newly available なものは、30 か月後に widely available になる。
  // browserslist の `baseline newly available` も同じデータをこう引く
  const date = new Date();
  date.setMonth(date.getMonth() + 30);
  return targetsOf(
    getCompatibleVersions({
      widelyAvailableOnDate: date.getTime(),
      // データが古いという警告は、アプリには直せない。読まれるのは
      // フレームワークが依存に持つ版で、アプリが入れた版ではない
      suppressWarnings: true,
    }),
  );
};
