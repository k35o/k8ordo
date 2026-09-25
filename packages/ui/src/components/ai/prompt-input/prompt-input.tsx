'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  FC,
  KeyboardEvent,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { useControllableState } from '../../../hooks/controllable-state';
import { useMessages } from '../../../i18n/context';
import { acceptsFile } from '../../../internal/accepts-file';
import { FOCUS_RING, FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { SendIcon } from '../../icons';
import {
  AttachmentPreview,
  isImageMediaType,
} from '../_internal/attachment-preview';
import { AttachIcon } from '../_internal/icons';
import { List as AttachmentList } from '../attachment/attachment';
import type { ChatStatus } from '../types';

type AttachedFile = {
  id: string;
  file: File;
};

const [PromptInputProvider, usePromptInputContext] = createSafeContext<{
  value: string;
  setValue: (value: string) => void;
  status: ChatStatus;
  stop: () => void;
  accept: string | undefined;
  maxFiles: number | undefined;
  files: AttachedFile[];
  /** accept に当たるファイルがあれば true（maxFiles で捨てたものも数える） */
  addFiles: (files: FileList) => boolean;
  removeFile: (id: string) => void;
}>('PromptInput.* must be used within <PromptInput.Root>');

const isBusy = (status: ChatStatus) =>
  status === 'submitted' || status === 'streaming';

const carriesFiles = (dataTransfer: DataTransfer) =>
  dataTransfer.types.includes('Files');

type RootProps = {
  status?: ChatStatus;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (message: string, files: FileList) => void;
  onStop?: () => void;
  accept?: string;
  maxFiles?: number;
  children: ReactNode;
};

export const Root: FC<RootProps> = ({
  status = 'ready',
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onStop,
  accept,
  maxFiles,
  children,
}) => {
  const isControlled = value !== undefined;
  const [text, setText] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  // 子要素をまたぐたびに dragenter / dragleave が対で飛ぶので、入れ子の深さで
  // 本当にフォームの外へ出たかを見分ける
  const dragDepthRef = useRef(0);

  const addFiles = useCallback(
    (incoming: FileList) => {
      if (accept === undefined) {
        return false;
      }
      const taken = Array.from(incoming)
        .filter((file) => acceptsFile(file, accept))
        .map((file) => ({ id: crypto.randomUUID(), file }));
      if (taken.length === 0) {
        return false;
      }
      setFiles((prev) =>
        [...prev, ...taken].slice(0, maxFiles ?? Number.POSITIVE_INFINITY),
      );
      return true;
    },
    [accept, maxFiles],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((attached) => attached.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      value: text,
      setValue: setText,
      status,
      stop: () => onStop?.(),
      accept,
      maxFiles,
      files,
      addFiles,
      removeFile,
    }),
    [
      text,
      setText,
      status,
      onStop,
      accept,
      maxFiles,
      files,
      addFiles,
      removeFile,
    ],
  );

  return (
    <PromptInputProvider value={contextValue}>
      {/* ドロップはポインタ操作の近道で、キーボードからは Attach で同じことができる */}
      {/* oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-element-interactions */}
      <form
        className={cn(
          'flex flex-wrap items-end gap-2 rounded-2xl border border-border-base bg-bg-base p-2 transition-colors duration-150 ease-out',
          FOCUS_RING_WITHIN,
          isDragging &&
            'border-dashed border-primary-border bg-primary-bg-subtle',
        )}
        data-dragging={isDragging || undefined}
        onDragEnter={(event) => {
          if (accept === undefined || !carriesFiles(event.dataTransfer)) {
            return;
          }
          dragDepthRef.current += 1;
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (accept === undefined || !carriesFiles(event.dataTransfer)) {
            return;
          }
          dragDepthRef.current -= 1;
          if (dragDepthRef.current === 0) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => {
          if (!carriesFiles(event.dataTransfer)) {
            return;
          }
          // 添付を受けないときも止める。止めないとブラウザがファイルを開き、
          // ページごと会話が消える。none にして、落とせないことをカーソルで示す
          event.preventDefault();
          event.dataTransfer.dropEffect =
            accept === undefined ? 'none' : 'copy';
        }}
        onDrop={(event) => {
          if (!carriesFiles(event.dataTransfer)) {
            return;
          }
          event.preventDefault();
          dragDepthRef.current = 0;
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        onSubmit={(event) => {
          event.preventDefault();
          if (isBusy(status)) {
            return;
          }
          const trimmed = text.trim();
          if (trimmed === '' && files.length === 0) {
            return;
          }
          const transfer = new DataTransfer();
          for (const { file } of files) {
            transfer.items.add(file);
          }
          onSubmit?.(trimmed, transfer.files);
          setFiles([]);
          if (!isControlled) {
            setText('');
          }
        }}
      >
        {children}
      </form>
    </PromptInputProvider>
  );
};

type TextareaProps = {
  placeholder?: string;
  ref?: Ref<HTMLTextAreaElement>;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'style' | 'rows'
>;

export const Textarea: FC<TextareaProps> = ({
  placeholder,
  onKeyDown,
  onPaste,
  ref,
  ...rest
}) => {
  const { value, setValue, status, addFiles } = usePromptInputContext();
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }
    // IME変換確定のEnterでは送信しない（日本語入力の確定と送信の衝突を防ぐ）。
    if (event.nativeEvent.isComposing) {
      return;
    }
    // 送信中はEnterで改行のみ許可。ready / error では送信（error は再送）。
    if (!isBusy(status)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <textarea
      {...rest}
      className={cn(
        // 高さは中身に合わせてブラウザが決める（min/max で行数を挟む）
        'max-h-48 min-h-10 min-w-0 flex-1 resize-none field-sizing-content bg-transparent text-fg-base outline-hidden p-2',
        'placeholder:text-fg-subtle',
      )}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onKeyDown={handleKeyDown}
      onPaste={(event) => {
        onPaste?.(event);
        if (event.defaultPrevented) {
          return;
        }
        // ファイルと一緒に届く文字列はファイル名や <img> の HTML で、
        // 本文として貼りたいものではない。上限で捨てたファイルでも同じ
        if (addFiles(event.clipboardData.files)) {
          event.preventDefault();
        }
      }}
      placeholder={placeholder}
      ref={ref}
      rows={1}
      value={value}
    />
  );
};

// src を state に持たず ref で差すのは、object URL の寿命を <img> の出入りに
// 結びつけ、外れたときに必ず revoke するため
const FileImage: FC<{ file: File; id: string; alt: string }> = ({
  file,
  id,
  alt,
}) => {
  const attachObjectUrl = useCallback(
    (img: HTMLImageElement) => {
      const url = URL.createObjectURL(file);
      img.src = url;
      return () => {
        URL.revokeObjectURL(url);
      };
    },
    [file],
  );

  return (
    <img
      alt={alt}
      className="size-full object-cover"
      id={id}
      ref={attachObjectUrl}
    />
  );
};

type AttachmentsProps = {
  label?: string;
};

export const Attachments: FC<AttachmentsProps> = ({ label }) => {
  const { files, removeFile } = usePromptInputContext();

  if (files.length === 0) {
    return null;
  }

  return (
    // 削除ボタンが右上へはみ出すぶんの余白を取る
    <div className="w-full px-1 pe-2 pt-2">
      <AttachmentList label={label}>
        {files.map(({ id, file }) => (
          <AttachmentPreview
            filename={file.name}
            key={id}
            mediaType={file.type}
            onRemove={() => {
              removeFile(id);
            }}
            renderImage={
              isImageMediaType(file.type)
                ? (image) => <FileImage file={file} {...image} />
                : undefined
            }
          />
        ))}
      </AttachmentList>
    </div>
  );
};

type AttachProps = {
  label?: string;
};

export const Attach: FC<AttachProps> = ({ label }) => {
  const messages = useMessages();
  const { accept, maxFiles, addFiles } = usePromptInputContext();
  const inputRef = useRef<HTMLInputElement>(null);

  if (accept === undefined) {
    return null;
  }

  return (
    <>
      <input
        accept={accept}
        hidden
        multiple={maxFiles !== 1}
        onChange={(event) => {
          if (event.currentTarget.files !== null) {
            addFiles(event.currentTarget.files);
          }
          // 同じファイルを選び直しても change が飛ぶよう、選択を空に戻す
          event.currentTarget.value = '';
        }}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <button
        aria-label={label ?? messages.attach}
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full text-fg-mute transition-colors duration-150 ease-out hover:bg-bg-subtle',
          FOCUS_RING,
        )}
        onClick={() => {
          inputRef.current?.click();
        }}
        type="button"
      >
        <AttachIcon size="sm" />
      </button>
    </>
  );
};

type SubmitProps = {
  sendLabel?: string;
  stopLabel?: string;
};

export const Submit: FC<SubmitProps> = ({ sendLabel, stopLabel }) => {
  const messages = useMessages();
  const { value, status, stop, files } = usePromptInputContext();

  if (isBusy(status)) {
    return (
      <button
        aria-label={stopLabel ?? messages.stop}
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary-fg transition-colors duration-150 ease-out',
          FOCUS_RING,
        )}
        onClick={stop}
        type="button"
      >
        <span aria-hidden className="size-3 rounded-xs bg-current" />
      </button>
    );
  }

  return (
    <button
      aria-label={sendLabel ?? messages.send}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary-fg transition-colors duration-150 ease-out',
        'disabled:cursor-not-allowed disabled:opacity-50',
        FOCUS_RING,
      )}
      disabled={value.trim() === '' && files.length === 0}
      type="submit"
    >
      <SendIcon size="sm" />
    </button>
  );
};
