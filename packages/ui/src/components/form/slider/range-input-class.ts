import { clsx } from 'clsx';

import styles from './range-input-class.module.css';

/**
 * `<input type="range">` を溝の上に重ね、見た目をつまみだけにするクラス。
 * 溝と塗りは部品側が描く。Slider と RangeSlider で共有する。
 */
export const rangeInputClass = (invalid: boolean): string =>
  clsx(styles.input, invalid && styles.invalid);
