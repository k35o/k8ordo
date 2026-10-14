import 'server-only';
import { clsx } from 'clsx';
import type { FC, HTMLAttributes } from 'react';

import { getMessages } from '../../../i18n/current';
import { CopyButton } from '../../buttons/copy-button';
import { highlight } from './highlight';

import highContrast from '../../_internal/high-contrast.module.css';
import styles from './code-block.module.css';

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
      className={clsx('writing-h', styles.root, highContrast.edge)}
    >
      {title === undefined ? (
        <span className={clsx(styles.label, styles.language)}>{lang}</span>
      ) : (
        <figcaption className={styles.label}>
          <code>{title}</code>
        </figcaption>
      )}
      <div className={styles.copy}>
        <CopyButton
          iconOnly
          label={getMessages().codeBlockCopy}
          size="sm"
          value={code}
        />
      </div>
      <div
        className={styles.code}
        // shiki が組んだ HTML をそのまま差し込む。コードは shiki が
        // エスケープし、注記の文字列もテキストノードとして渡している
        // oxlint-disable-next-line eslint-plugin-react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
};
