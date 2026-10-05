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

  // figcaption は figure の最初の子でないと名前にならないので、ラベルを先に
  // 置き、コピーボタンは面の右上に重ねる。親に引き伸ばされたときは、余った
  // 高さをラベルではなくコードが受ける
  return (
    <figure
      {...rest}
      className={cn(
        'ao-code-block writing-h relative grid grid-rows-[auto_1fr] rounded-lg',
        HIGH_CONTRAST_EDGE,
      )}
    >
      {title === undefined ? (
        <span className="ao-code-label select-none">{lang}</span>
      ) : (
        <figcaption className="ao-code-label">
          <code>{title}</code>
        </figcaption>
      )}
      <div className="ao-code-copy absolute inset-e-1.5 top-1.5">
        <CopyButton
          iconOnly
          label={getMessages().codeBlockCopy}
          size="sm"
          value={code}
        />
      </div>
      <div
        className="min-w-0"
        // shiki が組んだ HTML をそのまま差し込む。コードは shiki が
        // エスケープし、注記の文字列もテキストノードとして渡している
        // oxlint-disable-next-line eslint-plugin-react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
};
