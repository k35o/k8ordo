import { describe, expect, it } from 'vite-plus/test';

import { catalogPropIssues } from './index';

describe('catalogPropIssues', () => {
  it('正しい props には何も返さない', () => {
    expect(catalogPropIssues('Button', { label: 'OK' })).toStrictEqual([]);
  });

  it('型の合わない値と知らない prop を報告する', () => {
    expect(
      catalogPropIssues('Button', { label: 1, colour: 'primary' }),
    ).toStrictEqual([
      expect.stringContaining('Button.label'),
      expect.stringContaining('Unknown prop "colour"'),
    ]);
  });

  it('形式が後で解決する prop は値を確かめない', () => {
    expect(
      catalogPropIssues(
        'TextField',
        { name: 'nickname', defaultValue: { $bindState: '/form/nickname' } },
        { unresolved: ['defaultValue'] },
      ),
    ).toStrictEqual([]);
  });

  it('形式が後で解決する prop は必須でも欠けたことにしない', () => {
    expect(
      catalogPropIssues(
        'Button',
        { label: { $state: '/label' } },
        { unresolved: ['label'] },
      ),
    ).toStrictEqual([]);
  });

  it('後で解決すると言われても、知らない prop は報告する', () => {
    expect(
      catalogPropIssues(
        'Button',
        { label: 'OK', colour: { $state: '/colour' } },
        { unresolved: ['colour'] },
      ),
    ).toStrictEqual([expect.stringContaining('Unknown prop "colour"')]);
  });
});
