/** 色相 0〜359、彩度と明度は 0〜100 の整数。 */
export type Hsl = { h: number; s: number; l: number };

const HEX = /^#?(?<digits>[\da-f]{3}|[\da-f]{6})$/iu;

/**
 * `#rrggbb`（`#` は省いてよく、大文字も可）を小文字にそろえる。読めなければ
 * null。`shorthand` なら `#rgb` も 6 桁に広げて読む。打っている途中の `#256`
 * （`#2563eb` の打ちかけ）を色と取らないよう、打鍵のたびには広げない。
 */
export const parseHex = (
  text: string,
  { shorthand = false }: { shorthand?: boolean } = {},
): string | null => {
  const digits = HEX.exec(text.trim())?.groups?.['digits'];
  if (digits === undefined || (digits.length === 3 && !shorthand)) {
    return null;
  }
  const full = digits.length === 3 ? digits.replaceAll(/./gu, '$&$&') : digits;
  return `#${full.toLowerCase()}`;
};

const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16) / 255,
  Number.parseInt(hex.slice(3, 5), 16) / 255,
  Number.parseInt(hex.slice(5, 7), 16) / 255,
];

/**
 * 灰色（彩度 0）には色相が無いので、`fallbackHue` を残す。そうしないと
 * 彩度を 0 まで下げたとたんに色相のつまみが端へ飛ぶ。
 */
export const hexToHsl = (hex: string, fallbackHue = 0): Hsl => {
  const [r, g, b] = channels(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) {
    return { h: fallbackHue, s: 0, l: Math.round(lightness * 100) };
  }
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const sector =
    max === r
      ? ((g - b) / delta + 6) % 6
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return {
    h: Math.round(sector * 60) % 360,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
};

export const hslToHex = ({ h, s, l }: Hsl): string => {
  const saturation = s / 100;
  const lightness = l / 100;
  const amount = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset: number) => {
    const k = (offset + h / 30) % 12;
    const value = lightness - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
};

if (import.meta.vitest) {
  describe('parseHex', () => {
    it('#rrggbb の小文字にそろえる', () => {
      expect(parseHex('#0D9488')).toBe('#0d9488');
      expect(parseHex('0d9488')).toBe('#0d9488');
      expect(parseHex(' #0d9488 ')).toBe('#0d9488');
    });

    it('3 桁は shorthand のときだけ 1 桁ずつ重ねて 6 桁にする', () => {
      expect(parseHex('#f80', { shorthand: true })).toBe('#ff8800');
      expect(parseHex('#f80')).toBeNull();
    });

    it('桁数の違うものや 16 進でないものは読まない', () => {
      expect(parseHex('')).toBeNull();
      expect(parseHex('#')).toBeNull();
      expect(parseHex('#0d948')).toBeNull();
      expect(parseHex('#0d94888')).toBeNull();
      expect(parseHex('#0g9488')).toBeNull();
      expect(parseHex('##0d9488')).toBeNull();
    });
  });

  describe('hexToHsl', () => {
    it('原色と中間色', () => {
      expect(hexToHsl('#ff0000')).toStrictEqual({ h: 0, s: 100, l: 50 });
      expect(hexToHsl('#00ff00')).toStrictEqual({ h: 120, s: 100, l: 50 });
      expect(hexToHsl('#0000ff')).toStrictEqual({ h: 240, s: 100, l: 50 });
      expect(hexToHsl('#0d9488')).toStrictEqual({ h: 175, s: 84, l: 32 });
    });

    it('赤の手前（紫寄り）は 360 ではなく 0 に回る', () => {
      expect(hexToHsl('#ff0001').h).toBe(0);
      expect(hexToHsl('#ff00ff').h).toBe(300);
    });

    it('灰色は渡された色相を残す', () => {
      expect(hexToHsl('#808080', 175)).toStrictEqual({ h: 175, s: 0, l: 50 });
      expect(hexToHsl('#ffffff', 200)).toStrictEqual({ h: 200, s: 0, l: 100 });
      expect(hexToHsl('#000000')).toStrictEqual({ h: 0, s: 0, l: 0 });
    });
  });

  describe('hslToHex', () => {
    it('原色と中間色', () => {
      expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000');
      expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00');
      expect(hslToHex({ h: 240, s: 100, l: 50 })).toBe('#0000ff');
      expect(hslToHex({ h: 175, s: 84, l: 32 })).toBe('#0d968b');
    });

    it('明度の端は色相や彩度によらず白か黒', () => {
      expect(hslToHex({ h: 123, s: 45, l: 100 })).toBe('#ffffff');
      expect(hslToHex({ h: 123, s: 45, l: 0 })).toBe('#000000');
      expect(hslToHex({ h: 123, s: 0, l: 50 })).toBe('#808080');
    });
  });
}
