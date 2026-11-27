import { describe, expect, it } from 'vite-plus/test';

import { screenIssues, screenMessages } from './screen';
import type { ScreenInput, ScreenStep } from './screen';

const form: ScreenInput = {
  components: [
    { id: 'root', component: 'Stack', children: ['nickname', 'save'] },
    {
      id: 'nickname',
      component: 'TextField',
      name: 'nickname',
      label: 'ニックネーム',
      defaultValue: { '@path': '/nickname' },
    },
    {
      id: 'save',
      component: 'Button',
      label: '保存',
      press: {
        event: {
          name: 'save',
          context: { nickname: { '@path': '/nickname' } },
        },
      },
    },
  ],
  dataModel: { nickname: '' },
};

const shown: ScreenStep = { kind: 'show', screen: 'profile', input: form };

const kindsOf = (step: ScreenStep) =>
  screenMessages(step).map((message) =>
    Object.keys(message).filter((key) => key !== 'version'),
  );

describe('screenMessages', () => {
  it('画面を出すときは、作る、値を置く、部品を並べる の 3 通にする', () => {
    expect(kindsOf(shown)).toStrictEqual([
      ['createSurface'],
      ['updateDataModel'],
      ['updateComponents'],
    ]);
  });

  it('画面を変えるときは、部品を 1 通に、値は JSON pointer ごとに 1 通ずつにする', () => {
    const update: ScreenStep = {
      kind: 'update',
      screen: 'profile',
      input: {
        components: [
          {
            id: 'done',
            component: 'Alert',
            tone: 'success',
            message: '保存しました',
          },
        ],
        values: { '/saved': true, '/count': 1 },
      },
    };

    expect(screenMessages(update)).toStrictEqual([
      {
        version: '1.0',
        updateComponents: {
          surfaceId: 'profile',
          components: [
            {
              id: 'done',
              component: 'Alert',
              tone: 'success',
              message: '保存しました',
            },
          ],
        },
      },
      {
        version: '1.0',
        updateDataModel: { surfaceId: 'profile', path: '/saved', value: true },
      },
      {
        version: '1.0',
        updateDataModel: { surfaceId: 'profile', path: '/count', value: 1 },
      },
    ]);
  });
});

describe('screenIssues', () => {
  it('カタログに合う画面には何も言わない', () => {
    expect(screenIssues(shown)).toStrictEqual([]);
  });

  it('カタログに無い部品を挙げる', () => {
    expect(
      screenIssues({
        kind: 'show',
        screen: 'chart',
        input: {
          components: [
            { id: 'root', component: 'Stack', children: ['chart'] },
            { id: 'chart', component: 'PieChart' },
          ],
        },
      }),
    ).toContain('[chart] PieChart is not in the catalog.');
  });

  it('root の無い画面を咎める', () => {
    expect(
      screenIssues({
        kind: 'show',
        screen: 'empty',
        input: {
          components: [{ id: 'main', component: 'Stack', children: [] }],
        },
      }),
    ).toContain('No component has the id "root".');
  });

  it('部品の props がカタログのスキーマに合わなければ、A2UI の言葉で返す', () => {
    const issues = screenIssues({
      kind: 'show',
      screen: 'button',
      input: { components: [{ id: 'root', component: 'Button', label: 3 }] },
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^VALIDATION_FAILED: .*Button/);
  });

  it('JSON Schema が通しても、描くときに外す部品は catalog の検査で返す', () => {
    expect(
      screenIssues({
        kind: 'show',
        screen: 'table',
        input: {
          components: [
            {
              id: 'root',
              component: 'Table',
              columns: [{ label: '品目' }, { label: '数' }],
              rows: [['みかん']],
            },
          ],
        },
      }),
    ).toStrictEqual([
      '[root] Table.rows.0: Expected 2 cells (one per column), received 1',
    ]);
  });

  it('@path で結んだ値は、描く前の形のまま catalog の検査を通す', () => {
    expect(screenIssues(shown)).toStrictEqual([]);
  });

  it('前に出した画面への変更は、その画面の上で確かめる', () => {
    const update: ScreenStep = {
      kind: 'update',
      screen: 'profile',
      input: {
        components: [
          { id: 'root', component: 'Stack', children: ['nickname', 'done'] },
          {
            id: 'done',
            component: 'Alert',
            tone: 'success',
            message: '保存しました',
          },
        ],
      },
    };

    expect(screenIssues(update, [shown])).toStrictEqual([]);
  });

  it('出していない画面への変更を咎める', () => {
    expect(
      screenIssues(
        { kind: 'update', screen: 'settings', input: { values: { '/a': 1 } } },
        [shown],
      ),
    ).toStrictEqual(['There is no screen "settings".']);
  });

  it('変更で書いた部品も、カタログのスキーマで確かめる', () => {
    const issues = screenIssues(
      {
        kind: 'update',
        screen: 'profile',
        input: { components: [{ id: 'save', component: 'Button', label: 3 }] },
      },
      [shown],
    );

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^VALIDATION_FAILED: .*Button/);
  });
});
