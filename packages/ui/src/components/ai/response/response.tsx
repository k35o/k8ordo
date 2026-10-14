'use client';

import { useMemo, useRef } from 'react';
import type { FC } from 'react';
import { Streamdown } from 'streamdown';
import type {
  LinkSafetyConfig,
  StreamdownProps,
  StreamdownTranslations,
} from 'streamdown';

import { getMessages } from '../../../i18n/current';

import styles from './response.module.css';

type Props = {
  children: string;
  isStreaming?: boolean;
} & Omit<StreamdownProps, 'children' | 'className' | 'mode'>;

// streamdown の既定は { enabled: true } で、リンクを <a href> ではなく <button> に
// 差し替えて確認モーダルを挟む。修飾クリック・リンクアドレスのコピー・支援技術の
// link ロールが失われる代償が、素通しできる確認ダイアログの効果に見合わない
const defaultLinkSafety: LinkSafetyConfig = { enabled: false };

/**
 * ストリーミング対応の Markdown レンダラ。未クローズのコードブロックなど
 * 途中の Markdown も streamdown が破綻なく描画する。
 *
 * このコンポーネントは streamdown（optional peer）に依存する。見た目は
 * Response の CSS が持つので、Tailwind は要らない。
 *
 * `children` / `isStreaming` 以外の props は streamdown にそのまま渡る。
 */
export const Response: FC<Props> = ({
  children,
  isStreaming = false,
  linkSafety = defaultLinkSafety,
  translations,
  ...rest
}) => {
  const messages = getMessages();

  const mergedTranslations = useMemo<Partial<StreamdownTranslations>>(
    () => ({
      close: messages.close,
      copied: messages.responseCopied,
      copyCode: messages.responseCopyCode,
      copyLink: messages.responseCopyLink,
      copyTable: messages.responseCopyTable,
      copyTableAsCsv: messages.responseCopyTableAsCsv,
      copyTableAsMarkdown: messages.responseCopyTableAsMarkdown,
      copyTableAsTsv: messages.responseCopyTableAsTsv,
      downloadDiagram: messages.responseDownloadDiagram,
      downloadDiagramAsMmd: messages.responseDownloadDiagramAsMmd,
      downloadDiagramAsPng: messages.responseDownloadDiagramAsPng,
      downloadDiagramAsSvg: messages.responseDownloadDiagramAsSvg,
      downloadFile: messages.responseDownloadFile,
      downloadImage: messages.responseDownloadImage,
      downloadTable: messages.responseDownloadTable,
      downloadTableAsCsv: messages.responseDownloadTableAsCsv,
      downloadTableAsMarkdown: messages.responseDownloadTableAsMarkdown,
      exitFullscreen: messages.responseExitFullscreen,
      externalLinkWarning: messages.responseExternalLinkWarning,
      imageNotAvailable: messages.responseImageNotAvailable,
      openExternalLink: messages.responseOpenExternalLink,
      openLink: messages.responseOpenLink,
      viewFullscreen: messages.responseViewFullscreen,
      ...translations,
    }),
    [messages, translations],
  );

  // 確認ダイアログや表の全画面は、streamdown が既定で document.body へ出す。
  // Response の中に出して、見た目を当てる @scope の中に収める
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root}>
      <Streamdown
        className={styles.markdown}
        linkSafety={linkSafety}
        mode={isStreaming ? 'streaming' : 'static'}
        parseIncompleteMarkdown
        portal={() => overlayRef.current}
        translations={mergedTranslations}
        {...rest}
      >
        {children}
      </Streamdown>
      <div ref={overlayRef} />
    </div>
  );
};
