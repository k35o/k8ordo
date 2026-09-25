'use client';

import { useId } from 'react';
import type { FC, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { IconButton } from '../../buttons/icon-button';
import { CloseIcon } from '../../icons';
import { FileIcon } from './icons';

// AI SDK の FileUIPart は `image/png` のほかに最上位の `image` だけも許す
export const isImageMediaType = (mediaType: string): boolean =>
  mediaType === 'image' || mediaType.startsWith('image/');

type Props = {
  mediaType: string;
  filename?: string;
  renderImage?: (props: { id: string; alt: string }) => ReactNode;
  onRemove?: () => void;
};

export const AttachmentPreview: FC<Props> = ({
  mediaType,
  filename,
  renderImage,
  onRemove,
}) => {
  const messages = useMessages();
  const nameId = useId();

  return (
    <li className="relative">
      {renderImage === undefined ? (
        <div className="border-border-mute bg-bg-base flex max-w-60 items-center gap-2 rounded-xl border py-2 ps-2.5 pe-3">
          <span className="text-fg-mute shrink-0">
            <FileIcon size="sm" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span
              className="text-fg-base truncate text-sm font-medium"
              id={nameId}
            >
              {filename ?? mediaType}
            </span>
            {filename !== undefined && (
              <span className="text-fg-mute truncate text-xs">{mediaType}</span>
            )}
          </span>
        </div>
      ) : (
        <div className="border-border-mute bg-bg-subtle size-16 overflow-hidden rounded-xl border">
          {renderImage({
            id: nameId,
            alt: filename ?? messages.attachmentImage,
          })}
        </div>
      )}
      {onRemove !== undefined && (
        <span className="border-border-mute bg-bg-base absolute -top-2 -right-2 flex rounded-full border shadow-xs">
          <IconButton
            aria-describedby={nameId}
            label={messages.attachmentRemove}
            onClick={onRemove}
            size="sm"
          >
            <CloseIcon size="xs" />
          </IconButton>
        </span>
      )}
    </li>
  );
};
