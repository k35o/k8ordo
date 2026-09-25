import 'server-only';
import type { FC, HTMLAttributes } from 'react';

import { getMessages } from '../../../i18n/current';
import { CopyButton } from '../../buttons/copy-button';
import { highlight } from './highlight';

type Props = {
  code: string;
  lang?: string;
  title?: string;
  marks?: Readonly<Record<number, 'highlight' | 'add' | 'remove'>>;
  callouts?: Readonly<Record<number, string | readonly string[]>>;
} & Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'className' | 'lang' | 'style' | 'title'
>;

export const CodeBlock: FC<Props> = async ({
  code,
  lang = 'text',
  title,
  marks,
  callouts,
  ...rest
}) => {
  const html = await highlight(code, { lang, marks, callouts });

  // figcaption は figure の最初の子でないと名前にならないので、見出しの
  // 行は入れ子にせず、グリッドの 1 行目に並べる
  return (
    <figure
      {...rest}
      className="ao-code-block border-border-mute bg-bg-subtle writing-h grid grid-cols-[minmax(0,1fr)_auto] items-center overflow-hidden rounded-lg border"
    >
      {title === undefined ? (
        <span className="border-border-mute text-fg-mute self-stretch border-b py-2 ps-4 text-xs">
          {lang}
        </span>
      ) : (
        <figcaption className="border-border-mute text-fg-base self-stretch border-b py-1.5 ps-4 text-sm font-medium">
          {title}
        </figcaption>
      )}
      <div className="border-border-mute self-stretch border-b py-1 pe-2">
        <CopyButton
          iconOnly
          label={getMessages().codeBlockCopy}
          size="sm"
          value={code}
        />
      </div>
      <div
        className="col-span-2"
        // shiki が組んだ HTML をそのまま差し込む。コードは shiki が
        // エスケープし、注記の文字列もテキストノードとして渡している
        // oxlint-disable-next-line eslint-plugin-react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
};
