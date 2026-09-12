import type { FC } from 'react';
import { render } from 'vitest-browser-react';

import { defineDictionary } from './dictionary';
import type { Translations } from './dictionary';
import { defineLocales } from './locales';
import { LocaleProvider, useLocale } from './provider';
import { useTranslation } from './use-translation';

const locales = defineLocales(['ja', 'en']);
const ja = { hello: 'こんにちは', count: (n: number) => `${String(n)} 件` };
const en: Translations<typeof ja> = {
  hello: 'Hello',
  count: (n) => `${String(n)} items`,
};
const dictionary = defineDictionary(locales, { ja, en });

const Greeting: FC = () => {
  const { t, locale } = useTranslation(dictionary);
  return (
    <p data-testid="greeting" lang={locale}>
      {t('hello')} / {t('count', 3)}
    </p>
  );
};

const Bare: FC = () => <p data-testid="locale">{useLocale()}</p>;

describe('useTranslation', () => {
  it('reads the provider locale and answers from that locale messages', async () => {
    const screen = await render(
      <LocaleProvider locale="en">
        <Greeting />
      </LocaleProvider>,
    );
    await expect
      .element(screen.getByTestId('greeting'))
      .toHaveTextContent('Hello / 3 items');
    await expect
      .element(screen.getByTestId('greeting'))
      .toHaveAttribute('lang', 'en');
  });

  it('follows the provider when the locale changes', async () => {
    const screen = await render(
      <LocaleProvider locale="ja">
        <Greeting />
      </LocaleProvider>,
    );
    await expect
      .element(screen.getByTestId('greeting'))
      .toHaveTextContent('こんにちは / 3 件');
    screen.rerender(
      <LocaleProvider locale="en">
        <Greeting />
      </LocaleProvider>,
    );
    await expect
      .element(screen.getByTestId('greeting'))
      .toHaveTextContent('Hello / 3 items');
  });

  it('throws when the provider carries a locale the dictionary does not have', async () => {
    await expect(
      render(
        <LocaleProvider locale="fr">
          <Greeting />
        </LocaleProvider>,
      ),
    ).rejects.toThrow(/"fr", which is not one of/u);
  });
});

describe('useLocale', () => {
  it('returns the provider string as is without a locale set', async () => {
    const screen = await render(
      <LocaleProvider locale="en-GB">
        <Bare />
      </LocaleProvider>,
    );
    await expect
      .element(screen.getByTestId('locale'))
      .toHaveTextContent('en-GB');
  });

  it('throws outside a provider', async () => {
    await expect(render(<Bare />)).rejects.toThrow(/within a LocaleProvider/u);
  });
});
