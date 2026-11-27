import { describe, expect, it } from 'vite-plus/test';

import { issuesOf, messagesOf } from './show-ui';

const form = {
  components: [
    { id: 'root', component: 'Stack', children: ['nickname', 'save'] },
    {
      id: 'nickname',
      component: 'TextField',
      name: 'nickname',
      placeholder: 'ニックネーム',
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

describe('messagesOf', () => {
  it('作る、値を置く、部品を並べる の 3 通の A2UI メッセージにする', () => {
    expect(
      messagesOf(form).map((message) =>
        Object.keys(message).filter((key) => key !== 'version'),
      ),
    ).toStrictEqual([
      ['createSurface'],
      ['updateDataModel'],
      ['updateComponents'],
    ]);
  });
});

describe('issuesOf', () => {
  it('カタログに合う画面には何も言わない', () => {
    expect(issuesOf(form)).toStrictEqual([]);
  });

  it('カタログに無い部品を挙げる', () => {
    expect(
      issuesOf({
        components: [
          { id: 'root', component: 'Stack', children: ['chart'] },
          { id: 'chart', component: 'PieChart' },
        ],
      }),
    ).toContain('[chart] PieChart is not in the catalog.');
  });

  it('root の無い画面を咎める', () => {
    expect(
      issuesOf({
        components: [{ id: 'main', component: 'Stack', children: [] }],
      }),
    ).toContain('No component has the id "root".');
  });

  it('部品の props がカタログのスキーマに合わなければ、A2UI の言葉で返す', () => {
    const issues = issuesOf({
      components: [{ id: 'root', component: 'Button', label: 3 }],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^VALIDATION_FAILED: .*Button/);
  });
});
