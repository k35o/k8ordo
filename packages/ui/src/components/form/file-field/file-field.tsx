'use client';

import type {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  Ref,
} from 'react';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { useMessages } from '../../../i18n/context';
import { IconButton } from '../../buttons/icon-button';
import { CloseIcon } from '../../icons';
import { createSafeContext } from './../../../helpers/create-safe-context';
import { mergeRefs } from './../../../helpers/merge-refs';

type AcceptedFile = {
  file: File;
  id: string;
};

type FileFieldContext = {
  disabled: boolean;
  invalid: boolean;
  acceptedFiles: AcceptedFile[];
  onFileDelete: (id: string) => void;
  openFilePicker: () => void;
};

const [FileFieldProvider, useFileFieldContext] =
  createSafeContext<FileFieldContext>(
    'useFileFieldContext must be used within a FileField.Root',
  );

type RootProps = PropsWithChildren<
  {
    invalid?: boolean;
    maxFiles?: number;
    defaultValue?: File[];
    // event はファイル選択（input の change）時に渡る。プログラム的なファイル
    // 削除では change イベントが存在しないため undefined になる。
    onChange?: (
      files: FileList | null,
      event?: ChangeEvent<HTMLInputElement>,
    ) => void;
    webkitDirectory?: boolean;
    ref?: Ref<HTMLInputElement>;
  } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'className'
    | 'style'
    | 'onChange'
    | 'defaultValue'
    | 'value'
    | 'children'
  >
>;

const Root = ({
  children,
  disabled = false,
  invalid = false,
  required = false,
  multiple = false,
  maxFiles,
  defaultValue,
  onChange,
  webkitDirectory = false,
  ref,
  ...rest
}: RootProps) => {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  // 参照が変わるたびに React が ref の解除と再設定を行うため、
  // 利用者が副作用付きのコールバック ref を渡しても毎レンダー走らないようにする
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;

  const [acceptedFiles, setAcceptedFiles] = useState<AcceptedFile[]>(() =>
    (defaultValue ?? []).map((file) => ({
      file,
      id: crypto.randomUUID(),
    })),
  );

  const onFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.files, event);

      const files = Array.from(event.target.files ?? []);
      const newFiles = files.map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));
      const updatedFiles =
        multiple || webkitDirectory
          ? [...acceptedFiles, ...newFiles].slice(
              0,
              maxFiles ?? Number.POSITIVE_INFINITY,
            )
          : newFiles.slice(0, 1);

      setAcceptedFiles(updatedFiles);
    },
    [acceptedFiles, multiple, maxFiles, onChange, webkitDirectory],
  );

  const onFileDelete = useCallback(
    (fileId: string) => {
      const updatedFiles = acceptedFiles.filter((f) => f.id !== fileId);
      setAcceptedFiles(updatedFiles);

      if (inputRef.current && onChange) {
        const dataTransfer = new DataTransfer();
        for (const { file } of updatedFiles) {
          dataTransfer.items.add(file);
        }
        inputRef.current.files = dataTransfer.files;

        onChange(dataTransfer.files);
      }
    },
    [acceptedFiles, onChange],
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const contextValue = useMemo(
    () => ({
      disabled: disabledResolved,
      invalid,
      acceptedFiles,
      onFileDelete,
      openFilePicker,
    }),
    [disabledResolved, invalid, acceptedFiles, onFileDelete, openFilePicker],
  );

  return (
    <FileFieldProvider value={contextValue}>
      <div className="w-full">
        <input
          {...rest}
          aria-invalid={invalid}
          className="sr-only"
          disabled={disabledResolved}
          id={rest.id ?? generatedId}
          multiple={multiple}
          onChange={onFilesChange}
          ref={mergedRef}
          required={required}
          type="file"
          // @ts-expect-error -- webkitdirectoryがReactのHTMLInputElementのPropsに存在しないため
          // Baseline 2025の機能なので、利用に問題はない
          webkitdirectory={webkitDirectory ? 'true' : undefined}
        />
        {children}
      </div>
    </FileFieldProvider>
  );
};

const Trigger: FC<{
  renderItem: (props: {
    onClick: () => void;
    disabled: boolean;
    invalid: boolean;
  }) => ReactElement;
}> = ({ renderItem }) => {
  const context = useFileFieldContext();
  return renderItem({
    onClick: context.openFilePicker,
    disabled: context.disabled,
    invalid: context.invalid,
  });
};

const ItemList: FC<{
  showWebkitRelativePath?: boolean;
  clearable?: boolean;
}> = ({ showWebkitRelativePath, clearable }) => {
  const messages = useMessages();
  const { acceptedFiles, onFileDelete } = useFileFieldContext();

  if (acceptedFiles.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-2">
      {acceptedFiles.map((acceptedFile) => {
        const { file, id } = acceptedFile;
        const onDelete = () => {
          onFileDelete(id);
        };

        const sizeInKB = (file.size / 1024).toFixed(2);

        return (
          <li
            className="border-border-base bg-bg-base flex items-center justify-between rounded-xl border px-3 py-2"
            key={id}
          >
            <div className="flex flex-col gap-1">
              <span className="text-fg-base text-sm font-medium">
                {showWebkitRelativePath === true
                  ? file.webkitRelativePath
                  : file.name}
              </span>
              <span className="text-fg-mute text-xs">{sizeInKB} KB</span>
            </div>
            {clearable === true && (
              <IconButton label={messages.fileFieldRemove} onClick={onDelete}>
                <CloseIcon size="sm" />
              </IconButton>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const FileField = {
  Root,
  Trigger,
  ItemList,
} as const;
