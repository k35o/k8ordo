import { useId } from 'react';
import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { IconButton } from '../../buttons/icon-button';
import { CloseIcon } from '../../icons';
import { FileIcon } from './icons';

import styles from './attachment-preview.module.css';

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
  const messages = getMessages();
  const nameId = useId();

  return (
    <li className={styles.root}>
      {renderImage === undefined ? (
        <div className={styles.file}>
          <span className={styles.fileIcon}>
            <FileIcon size="sm" />
          </span>
          <span className={styles.fileText}>
            <span className={styles.name} id={nameId}>
              {filename ?? mediaType}
            </span>
            {filename !== undefined && (
              <span className={styles.mediaType}>{mediaType}</span>
            )}
          </span>
        </div>
      ) : (
        <div className={styles.image}>
          {renderImage({
            id: nameId,
            alt: filename ?? messages.attachmentImage,
          })}
        </div>
      )}
      {onRemove !== undefined && (
        <span className={styles.remove}>
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
