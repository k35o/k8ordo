'use client';

import {
  Suspense,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FC, KeyboardEvent } from 'react';
import { browser } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { getLocale, getMessages } from '../../../i18n/current';
import {
  addDays,
  addMonths,
  clampDate,
  endOfMonth,
  formatDate,
  isIsoDate,
  isSameMonth,
  isWithin,
  localToday,
  monthWeeks,
  startOfMonth,
  startOfWeek,
} from '../../../internal/iso-date';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { IconButton } from '../../buttons/icon-button';
import { ChevronIcon } from '../../icons';

type Props = {
  /** `YYYY-MM-DD`。制御モードで未選択を表すときは `null`。 */
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** これより前の日は選べない（`YYYY-MM-DD`）。 */
  min?: string;
  /** これより後の日は選べない（`YYYY-MM-DD`）。 */
  max?: string;
};

// サーバーの HTML に描く代わりの箱。本体と同じ寸法にして、ブラウザで
// 描き直したときに周りが動かないようにする
const FALLBACK_SIZE = 'block-76 inline-70';

export const Calendar: FC<Props> = (props) => (
  <Suspense
    fallback={<div aria-hidden className={cn('writing-h', FALLBACK_SIZE)} />}
  >
    <CalendarBody {...props} />
  </Suspense>
);

const orUndefined = (value: string | undefined): string | undefined =>
  value !== undefined && isIsoDate(value) ? value : undefined;

const CalendarBody: FC<Props> = ({
  value,
  defaultValue,
  onChange,
  min: minProp,
  max: maxProp,
}) => {
  // 「今日」は閲覧者のタイムゾーンでしか決まらないので、サーバーでは描かない
  use(browser('Calendar は閲覧者のタイムゾーンで今日を決める'));
  const messages = getMessages();
  const labelId = useId();
  const gridRef = useRef<HTMLTableElement>(null);

  const locale = getLocale();
  // Intl のフォーマッタはロケールの解決を伴って作るのが重いので、日を移すたびの
  // 描き直しで作り直さない
  const {
    firstDay,
    monthFormat,
    dayFormat,
    weekdayShort,
    weekdayLong,
    dayNumber,
  } = useMemo(
    () => ({
      // getWeekInfo の firstDay は ISO の表し方（1 = 月 … 7 = 日）。iso-date.ts の
      // 表し方（Date#getUTCDay と同じ 0 = 日 … 6 = 土）に合わせる
      firstDay: new Intl.Locale(locale).getWeekInfo().firstDay % 7,
      monthFormat: new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        timeZone: 'UTC',
      }),
      dayFormat: new Intl.DateTimeFormat(locale, {
        dateStyle: 'full',
        timeZone: 'UTC',
      }),
      weekdayShort: new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        timeZone: 'UTC',
      }),
      weekdayLong: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        timeZone: 'UTC',
      }),
      dayNumber: new Intl.NumberFormat(locale, { useGrouping: false }),
    }),
    [locale],
  );

  const min = orUndefined(minProp);
  const max = orUndefined(maxProp);
  const today = localToday(new Date());
  const [selected, setSelected] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: (next) => {
      if (next !== null) {
        onChange?.(next);
      }
    },
  });
  const selectedDate =
    selected !== null && isIsoDate(selected) ? selected : null;

  const [focused, setFocused] = useState(() =>
    clampDate(selectedDate ?? today, min, max),
  );
  // 選択が外から変わったら、その日のある月を開く
  const [shownSelection, setShownSelection] = useState(selectedDate);
  if (shownSelection !== selectedDate) {
    setShownSelection(selectedDate);
    if (selectedDate !== null) {
      setFocused(selectedDate);
    }
  }

  // キーボードで日を移したときだけ、描き直した先のボタンへフォーカスを追わせる。
  // 月送りのボタンで移したときはフォーカスをボタンに残す
  const followFocus = useRef(false);
  useEffect(() => {
    if (!followFocus.current) {
      return;
    }
    followFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)
      ?.focus();
  }, [focused]);

  const previousMonth = addMonths(focused, -1);
  const nextMonth = addMonths(focused, 1);
  const canGoPrevious = min === undefined || endOfMonth(previousMonth) >= min;
  const canGoNext = max === undefined || startOfMonth(nextMonth) <= max;

  const weeks = monthWeeks(focused, firstDay);
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    formatDate(addDays(startOfWeek(today, firstDay), index)),
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? -1 : 1;
    const moves: Record<string, () => string> = {
      ArrowRight: () => addDays(focused, forward),
      ArrowLeft: () => addDays(focused, -forward),
      ArrowDown: () => addDays(focused, 7),
      ArrowUp: () => addDays(focused, -7),
      Home: () => startOfWeek(focused, firstDay),
      End: () => addDays(startOfWeek(focused, firstDay), 6),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (move === undefined) {
      return;
    }
    event.preventDefault();
    followFocus.current = true;
    setFocused(clampDate(move(), min, max));
  };

  return (
    <div className="writing-h inline-flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <IconButton
          color="transparent"
          disabled={!canGoPrevious}
          label={messages.calendarPreviousMonth}
          onClick={() => {
            setFocused(clampDate(previousMonth, min, max));
          }}
          size="sm"
          tooltipDisabled
        >
          <ChevronIcon direction="left" size="sm" />
        </IconButton>
        <p aria-live="polite" className="font-bold tabular-nums" id={labelId}>
          {monthFormat.format(formatDate(focused))}
        </p>
        <IconButton
          color="transparent"
          disabled={!canGoNext}
          label={messages.calendarNextMonth}
          onClick={() => {
            setFocused(clampDate(nextMonth, min, max));
          }}
          size="sm"
          tooltipDisabled
        >
          <ChevronIcon direction="right" size="sm" />
        </IconButton>
      </div>
      <table
        aria-labelledby={labelId}
        className="border-collapse"
        onKeyDown={handleKeyDown}
        ref={gridRef}
        role="grid"
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                abbr={weekdayLong.format(weekday)}
                className="text-fg-mute text-xs font-medium block-8"
                key={weekday.getTime()}
                scope="col"
              >
                {weekdayShort.format(weekday)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]}>
              {week.map((date) => {
                if (!isSameMonth(date, focused)) {
                  return (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label -- 月の外の日は空欄にする。押せる日が隣の月にもあると、どの月を見ているのかが曖昧になる
                    <td className="size-10 p-0" key={date} role="gridcell" />
                  );
                }
                const isSelected = date === selectedDate;
                const isFocused = date === focused;
                const selectable = isWithin(date, min, max);
                return (
                  <td
                    aria-selected={isSelected}
                    className="p-0"
                    key={date}
                    role="gridcell"
                  >
                    <button
                      aria-current={date === today ? 'date' : undefined}
                      aria-disabled={selectable ? undefined : true}
                      aria-label={dayFormat.format(formatDate(date))}
                      className={cn(
                        'inline-flex size-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors',
                        FOCUS_RING_NO_BORDER,
                        'hover:bg-bg-mute',
                        date === today && 'font-bold text-primary-fg',
                        isSelected &&
                          'bg-primary-bg text-primary-fg hover:bg-primary-bg-emphasize',
                        !selectable &&
                          'cursor-not-allowed text-fg-subtle hover:bg-transparent',
                      )}
                      data-autofocus={isFocused ? '' : undefined}
                      data-date={date}
                      onClick={() => {
                        if (selectable) {
                          setSelected(date);
                        }
                      }}
                      onFocus={() => {
                        setFocused(date);
                      }}
                      tabIndex={isFocused ? 0 : -1}
                      type="button"
                    >
                      {dayNumber.format(Number(date.slice(8)))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
