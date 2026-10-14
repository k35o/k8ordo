/**
 * 色のトークンを、今の配色で getComputedStyle が返す形に解決する。部品が
 * どのトークンで塗られているかを、クラス名でなく見た目の値で確かめるために使う。
 */
export const tokenColor = (token: `--color-${string}`): string => {
  const probe = document.createElement('div');
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};
