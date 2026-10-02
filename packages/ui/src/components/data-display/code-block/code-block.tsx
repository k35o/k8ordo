import 'server-only';
import type { FC, HTMLAttributes } from 'react';

import { cn } from '../../../helpers/cn';
import { getMessages } from '../../../i18n/current';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
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
  // 行は入れ子にせず、グリッドの 1 行目に並べる。親に引き伸ばされたときは、
  // 余った高さを見出しの行ではなくコードの行が受ける
  return (
    <figure
      {...rest}
      className={cn(
        'ao-code-block writing-h grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_1fr] overflow-hidden rounded-lg',
        HIGH_CONTRAST_EDGE,
      )}
    >
      {title === undefined ? (
        <span className="flex items-center bg-(--ao-code-header) py-2 ps-4 text-xs text-(--ao-code-label) lowercase select-none">
          {lang}
        </span>
      ) : (
        <figcaption className="flex items-center bg-(--ao-code-header) py-2 ps-4 text-[0.8rem] text-(--ao-code-caption)">
          <code>{title}</code>
        </figcaption>
      )}
      <div className="flex items-center bg-(--ao-code-header) py-1 pe-2">
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
