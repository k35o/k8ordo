'use client';

import { Combobox } from '@k8ordo/ui';
import type { ComboboxSearch } from '@k8ordo/ui';

const CITIES = [
  'Sapporo',
  'Sendai',
  'Saitama',
  'Chiba',
  'Yokohama',
  'Kawasaki',
  'Niigata',
  'Kanazawa',
  'Nagoya',
  'Kyoto',
  'Osaka',
  'Kobe',
  'Hiroshima',
  'Fukuoka',
  'Kagoshima',
].map((city) => ({ value: city.toLowerCase(), label: city }));

// サーバーの代わり。少し待ってから前方一致で返し、打ち切られたら諦める
const searchCities: ComboboxSearch = (query, { signal }) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(
        CITIES.filter((city) =>
          city.label.toLowerCase().startsWith(query.trim().toLowerCase()),
        ),
      );
    }, 400);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The search was aborted', 'AbortError'));
    });
  });

export function ComboboxAsyncPreview() {
  return (
    <div className="w-full max-w-xs">
      <Combobox aria-label="City" name="city" search={searchCities} />
    </div>
  );
}
