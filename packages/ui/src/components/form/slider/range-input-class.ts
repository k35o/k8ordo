import { cn } from '../../../helpers/cn';

/**
 * `<input type="range">` を溝の上に重ね、見た目をつまみだけにするクラス。
 * 溝と塗りは部品側が描く。Slider と RangeSlider で共有する。
 */
export const rangeInputClass = (invalid: boolean): string =>
  cn(
    'absolute inset-0 z-10 appearance-none bg-transparent',
    'h-8 w-full vertical:h-auto vertical:w-8 vertical:[writing-mode:vertical-lr]',
    'focus:outline-none',
    'disabled:cursor-not-allowed',
    '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
    '[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border-base [&::-webkit-slider-thumb]:bg-bg-base [&::-webkit-slider-thumb]:shadow-xs',
    '[&:focus-visible::-webkit-slider-thumb]:border-transparent [&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-border-info',
    '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent',
    '[&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-transparent',
    '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border-base [&::-moz-range-thumb]:bg-bg-base [&::-moz-range-thumb]:shadow-xs',
    '[&:focus-visible::-moz-range-thumb]:border-transparent [&:focus-visible::-moz-range-thumb]:ring-2 [&:focus-visible::-moz-range-thumb]:ring-border-info',
    invalid &&
      '[&::-moz-range-thumb]:border-border-error [&::-webkit-slider-thumb]:border-border-error [&:focus-visible::-moz-range-thumb]:ring-border-error [&:focus-visible::-webkit-slider-thumb]:ring-border-error',
  );
