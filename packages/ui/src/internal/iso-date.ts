/**
 * `YYYY-MM-DD`（`<input type="date">` の value と `z.iso.date()` の形）のまま
 * 暦日を扱う。
 *
 * 暦日はタイムゾーンを持たないので、計算は UTC の Date で行い、書式にも
 * `timeZone: 'UTC'` を渡す。ローカル時刻の Date で持つと、UTC より西の
 * タイムゾーンで 1 日前にずれる。Temporal.PlainDate が本来の道具だが、
 * Baseline に入っていない。
 */

export type IsoDate = string;

const ISO_DATE = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/u;

// Date.UTC は 0〜99 年を 1900 年代に読み替えるため、年は setUTCFullYear で入れる
const utc = (year: number, monthIndex: number, day: number): Date => {
  const date = new Date(0);
  date.setUTCFullYear(year, monthIndex, day);
  return date;
};

const pad = (value: number, length: number): string =>
  String(value).padStart(length, '0');

const fromUtc = (date: Date): IsoDate =>
  `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}`;

/** 実在する暦日の `YYYY-MM-DD` なら UTC の Date を返す（2 月 30 日などは null）。 */
export const toUtcDate = (value: string): Date | null => {
  const groups = ISO_DATE.exec(value)?.groups;
  if (groups === undefined) {
    return null;
  }
  const year = Number(groups['year']);
  const month = Number(groups['month']);
  const day = Number(groups['day']);
  const date = utc(year, month - 1, day);
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? date
    : null;
};

export const isIsoDate = (value: string): boolean => toUtcDate(value) !== null;

const parts = (value: IsoDate): [number, number, number] => {
  const date = toUtcDate(value);
  if (date === null) {
    throw new RangeError(`YYYY-MM-DD の暦日ではありません: ${value}`);
  }
  return [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()];
};

export const addDays = (value: IsoDate, days: number): IsoDate => {
  const [year, month, day] = parts(value);
  return fromUtc(utc(year, month, day + days));
};

const daysInMonth = (year: number, monthIndex: number): number =>
  utc(year, monthIndex + 1, 0).getUTCDate();

/** 月をまたいでも日は繰り越さず、移った先の月末で止める（1/31 の翌月は 2/28）。 */
export const addMonths = (value: IsoDate, months: number): IsoDate => {
  const [year, month, day] = parts(value);
  const first = utc(year, month + months, 1);
  const lastDay = daysInMonth(first.getUTCFullYear(), first.getUTCMonth());
  first.setUTCDate(Math.min(day, lastDay));
  return fromUtc(first);
};

export const startOfMonth = (value: IsoDate): IsoDate => {
  const [year, month] = parts(value);
  return fromUtc(utc(year, month, 1));
};

export const endOfMonth = (value: IsoDate): IsoDate => {
  const [year, month] = parts(value);
  return fromUtc(utc(year, month + 1, 0));
};

/** 0 = 日曜 … 6 = 土曜（`Date#getUTCDay` と同じ）。 */
export const dayOfWeek = (value: IsoDate): number => {
  const [year, month, day] = parts(value);
  return utc(year, month, day).getUTCDay();
};

/** 週の始まりの曜日（0 = 日曜）から数えて、その日を含む週の初日。 */
export const startOfWeek = (value: IsoDate, firstDay: number): IsoDate =>
  addDays(value, -((dayOfWeek(value) - firstDay + 7) % 7));

export const isSameMonth = (a: IsoDate, b: IsoDate): boolean =>
  a.slice(0, 7) === b.slice(0, 7);

/** 4 桁の年の `YYYY-MM-DD` は文字列の順がそのまま日付の順になる。 */
export const clampDate = (
  value: IsoDate,
  min: IsoDate | undefined,
  max: IsoDate | undefined,
): IsoDate => {
  if (min !== undefined && value < min) {
    return min;
  }
  if (max !== undefined && value > max) {
    return max;
  }
  return value;
};

export const isWithin = (
  value: IsoDate,
  min: IsoDate | undefined,
  max: IsoDate | undefined,
): boolean =>
  (min === undefined || value >= min) && (max === undefined || value <= max);

/**
 * 月の表に並べる 6 週ぶんの日付。月の外の日も含む。行数を月ごとに変えないのは、
 * 月を送ったときに高さが変わってポップオーバーの下の縁が跳ねないようにするため。
 */
export const monthWeeks = (month: IsoDate, firstDay: number): IsoDate[][] => {
  const start = startOfWeek(startOfMonth(month), firstDay);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_day, weekday) =>
      addDays(start, week * 7 + weekday),
    ),
  );
};

/** 書式用の UTC の Date。`Intl.DateTimeFormat` には `timeZone: 'UTC'` と組で渡す。 */
export const formatDate = (value: IsoDate): Date => {
  const [year, month, day] = parts(value);
  return utc(year, month, day);
};

/** 閲覧者のタイムゾーンでの今日。サーバーでは閲覧者の今日が分からないので、ブラウザでだけ呼ぶ。 */
export const localToday = (now: Date): IsoDate =>
  `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1, 2)}-${pad(now.getDate(), 2)}`;

if (import.meta.vitest) {
  describe('toUtcDate', () => {
    it('実在しない日付は受け付けない', () => {
      expect(toUtcDate('2023-02-29')).toBeNull();
      expect(toUtcDate('2024-02-29')).not.toBeNull();
      expect(toUtcDate('2023-13-01')).toBeNull();
      expect(toUtcDate('2023-1-01')).toBeNull();
      expect(toUtcDate('')).toBeNull();
    });

    it('0〜99 年を 1900 年代に読み替えない', () => {
      expect(toUtcDate('0050-06-01')?.getUTCFullYear()).toBe(50);
    });
  });

  describe('addDays', () => {
    it('月と年の境目をまたぐ', () => {
      expect(addDays('2023-01-31', 1)).toBe('2023-02-01');
      expect(addDays('2023-01-01', -1)).toBe('2022-12-31');
      expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    });
  });

  describe('addMonths', () => {
    it('移った先に同じ日が無ければ月末で止める', () => {
      expect(addMonths('2023-01-31', 1)).toBe('2023-02-28');
      expect(addMonths('2024-03-31', -1)).toBe('2024-02-29');
      expect(addMonths('2023-12-15', 1)).toBe('2024-01-15');
      expect(addMonths('2023-01-15', -12)).toBe('2022-01-15');
    });
  });

  describe('startOfWeek', () => {
    it('週の始まりの曜日に合わせて戻る', () => {
      // 2023-01-04 は水曜
      expect(startOfWeek('2023-01-04', 0)).toBe('2023-01-01');
      expect(startOfWeek('2023-01-04', 1)).toBe('2023-01-02');
      expect(startOfWeek('2023-01-01', 1)).toBe('2022-12-26');
    });
  });

  describe('monthWeeks', () => {
    it('月の 1 日を含む週から 6 週ぶん並べる', () => {
      // 2023 年 2 月 1 日は水曜
      const weeks = monthWeeks('2023-02-14', 0);

      expect(weeks).toHaveLength(6);
      expect(weeks[0]).toStrictEqual([
        '2023-01-29',
        '2023-01-30',
        '2023-01-31',
        '2023-02-01',
        '2023-02-02',
        '2023-02-03',
        '2023-02-04',
      ]);
      expect(weeks[5]?.[6]).toBe('2023-03-11');
    });

    it('月曜始まりでは列がずれる', () => {
      expect(monthWeeks('2023-02-14', 1)[0]?.[0]).toBe('2023-01-30');
    });
  });

  describe('clampDate', () => {
    it('範囲の外を端に寄せる', () => {
      expect(clampDate('2023-01-01', '2023-02-01', undefined)).toBe(
        '2023-02-01',
      );
      expect(clampDate('2023-03-01', undefined, '2023-02-01')).toBe(
        '2023-02-01',
      );
      expect(clampDate('2023-02-10', '2023-02-01', '2023-02-28')).toBe(
        '2023-02-10',
      );
    });
  });
}
