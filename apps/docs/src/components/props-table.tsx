import { Code } from '@k8ordo/ui';
import type { FC } from 'react';

import { LocaleAnchor } from './locale-anchor';
import { T } from './t';

export type PropItem = {
  name: string;
  types: readonly string[];
  defaultValue: string | null;
};

const TypeCodes: FC<{ types: readonly string[] }> = ({ types }) => (
  <span className="inline-flex items-center gap-1">
    {types.map((type, i) => (
      <span className="flex items-center gap-1" key={type}>
        {i > 0 && <span className="text-fg-mute/60">|</span>}
        <Code>{type}</Code>
      </span>
    ))}
  </span>
);

const DefaultValue: FC<{ value: string | null }> = ({ value }) =>
  value !== null && value !== '' ? <Code>{value}</Code> : <>-</>;

export const PropsTable: FC<{
  items: readonly PropItem[];
  inherits?: string;
  /** Default 欄に `messages.*` を持つ props があるとき、辞書の説明へ導く */
  messagesNote?: boolean;
}> = ({ items, inherits, messagesNote = false }) => (
  <div className="flex flex-col gap-4">
    <dl className="flex flex-col gap-4 md:hidden">
      {items.map((prop) => (
        <div
          className="border-border-mute flex flex-col gap-1 border-b pb-4"
          key={prop.name}
        >
          <dt className="font-medium">
            <Code>{prop.name}</Code>
          </dt>
          <dd className="text-fg-mute text-sm">
            <span className="text-fg-mute/60">Type: </span>
            <TypeCodes types={prop.types} />
          </dd>
          <dd className="text-fg-mute text-sm">
            <span className="text-fg-mute/60">Default: </span>
            <DefaultValue value={prop.defaultValue} />
          </dd>
        </div>
      ))}
    </dl>
    <table className="hidden w-full text-left text-sm md:table">
      <thead>
        <tr className="border-border-mute border-b">
          <th className="py-3 pr-6 font-medium whitespace-nowrap">Prop</th>
          <th className="py-3 pr-6 font-medium whitespace-nowrap">Type</th>
          <th className="py-3 font-medium whitespace-nowrap">Default</th>
        </tr>
      </thead>
      <tbody className="text-fg-mute">
        {items.map((prop) => (
          <tr className="border-border-mute border-b" key={prop.name}>
            <td className="py-3 pr-6 whitespace-nowrap">
              <Code>{prop.name}</Code>
            </td>
            <td className="py-3 pr-6">
              <TypeCodes types={prop.types} />
            </td>
            <td className="py-3 whitespace-nowrap">
              <DefaultValue value={prop.defaultValue} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {inherits !== undefined && inherits !== '' ? (
      <p className="text-fg-mute text-sm">
        <T k="components.common.inheritsLabel" /> <Code>{inherits}</Code>
      </p>
    ) : null}
    {messagesNote ? (
      <p className="text-fg-mute text-sm">
        <T k="components.common.messagesNote" />{' '}
        <LocaleAnchor path="/ui/i18n">
          <T k="nav.i18n" />
        </LocaleAnchor>
      </p>
    ) : null}
  </div>
);
