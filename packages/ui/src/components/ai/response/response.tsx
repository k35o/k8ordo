'use client';

import { useMemo } from 'react';
import type { FC } from 'react';
import { Streamdown } from 'streamdown';
import type {
  LinkSafetyConfig,
  StreamdownProps,
  StreamdownTranslations,
} from 'streamdown';

import { useMessages } from '../../../i18n/context';

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
 * このコンポーネントは streamdown（optional peer）に依存する。利用側は
 * `pnpm add streamdown` に加え、`streamdown/styles.css` の読み込みと
 * Tailwind の `@source` 設定が必要。詳細は docs を参照。
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
  const messages = useMessages();

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

  return (
    <Streamdown
      className="text-fg-base"
      linkSafety={linkSafety}
      mode={isStreaming ? 'streaming' : 'static'}
      parseIncompleteMarkdown
      translations={mergedTranslations}
      {...rest}
    >
      {children}
    </Streamdown>
  );
};
