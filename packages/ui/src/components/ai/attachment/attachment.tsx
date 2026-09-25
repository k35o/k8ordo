import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import {
  AttachmentPreview,
  isImageMediaType,
} from '../_internal/attachment-preview';

type ListProps = {
  label?: string;
  children: ReactNode;
};

export const List: FC<ListProps> = ({ label, children }) => {
  const messages = getMessages();

  return (
    <ul
      aria-label={label ?? messages.attachments}
      className="flex flex-wrap gap-2"
    >
      {children}
    </ul>
  );
};

type ItemProps = {
  url: string;
  mediaType: string;
  filename?: string;
};

export const Item: FC<ItemProps> = ({ url, mediaType, filename }) => (
  <AttachmentPreview
    filename={filename}
    mediaType={mediaType}
    renderImage={
      isImageMediaType(mediaType)
        ? ({ id, alt }) => (
            <img
              alt={alt}
              className="size-full object-cover"
              id={id}
              src={url}
            />
          )
        : undefined
    }
  />
);
