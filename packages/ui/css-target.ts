// Lightning CSS が下げて書き換えないよう、新しいブラウザを target にする。
// 既定の target では :dir() が :lang() の並びに、入れ子が平らに書き換わる。
// Baseline の newly available をそのまま使う方針なので、下げる先は持たない
export const CSS_TARGET = ['chrome146', 'edge146', 'firefox151', 'safari26'];

// css.transformer が lightningcss のとき、Vite は build.cssTarget を変換に使わず、
// css.lightningcss.targets が無ければ Baseline の widely available に下げる。
// light-dark() が --lightningcss-light / -dark の置き換えになると、:root の
// トークンが :root の配色で決まり、開発とテストで入れ子の .dark が暗くならない
export const LIGHTNINGCSS_TARGETS = Object.fromEntries(
  CSS_TARGET.map((target) => {
    const [, browser = '', major = ''] = /^([a-z]+)(\d+)$/u.exec(target) ?? [];
    return [browser, Number(major) << 16];
  }),
);
