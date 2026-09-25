'use client';

import type {
  ChangeEvent,
  DragEvent,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { getMessages } from '../../../i18n/current';
import { acceptsFile } from '../../../internal/accepts-file';
import { Button } from '../../buttons/button';
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
  onFilesDrop: (files: File[]) => void;
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
    // 文字列は @k8ordo/form の formFields が導く input の defaultValue の型。
    // ファイルの欄に値が入ることはないが、広げたまま受けられるように型だけ受ける
    defaultValue?: File[] | string;
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

export const Root = ({
  children,
  disabled = false,
  invalid = false,
  required = false,
  multiple = false,
  accept,
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

  const initialFiles = Array.isArray(defaultValue) ? defaultValue : [];
  const [acceptedFiles, setAcceptedFiles] = useState<AcceptedFile[]>(() =>
    initialFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
    })),
  );

  // form の reset はファイルを空に戻すが、change は飛ばないので一覧が取り残される
  const handleReset = useEffectEvent(() => {
    setAcceptedFiles(
      initialFiles.map((file) => ({ file, id: crypto.randomUUID() })),
    );
  });

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return undefined;
    }
    const listener = () => {
      handleReset();
    };
    form.addEventListener('reset', listener);
    return () => {
      form.removeEventListener('reset', listener);
    };
  }, []);

  // 送信されるのは input の files なので、一覧と同じ並びを input にも持たせる
  const syncInput = useCallback((files: AcceptedFile[]): FileList | null => {
    const input = inputRef.current;
    if (input === null) {
      return null;
    }
    const dataTransfer = new DataTransfer();
    for (const { file } of files) {
      dataTransfer.items.add(file);
    }
    input.files = dataTransfer.files;
    return input.files;
  }, []);

  const withAdded = useCallback(
    (files: File[]): AcceptedFile[] => {
      const newFiles = files.map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));
      return multiple || webkitDirectory
        ? [...acceptedFiles, ...newFiles].slice(
            0,
            maxFiles ?? Number.POSITIVE_INFINITY,
          )
        : newFiles.slice(0, 1);
    },
    [acceptedFiles, multiple, maxFiles, webkitDirectory],
  );

  // 選び直すと input にはその回に選んだ分しか残らないので、一覧に足した結果を
  // 書き戻す。書き戻さないと、一覧にあるのに送られないファイルが出る
  const onFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedFiles = withAdded(Array.from(event.target.files ?? []));
      setAcceptedFiles(updatedFiles);
      syncInput(updatedFiles);
      onChange?.(event.target.files, event);
    },
    [onChange, syncInput, withAdded],
  );

  // ドロップはブラウザが input を通らないので、accept も当たらず、change も
  // input イベントも出ない。accept で選り分けたうえで、選んだときと同じく一覧と
  // input を揃え、input イベントで form 側に知らせる
  const onFilesDrop = useCallback(
    (files: File[]) => {
      const taken =
        accept === undefined
          ? files
          : files.filter((file) => acceptsFile(file, accept));
      if (taken.length === 0) {
        return;
      }
      const updatedFiles = withAdded(taken);
      setAcceptedFiles(updatedFiles);
      const list = syncInput(updatedFiles);
      inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
      onChange?.(list);
    },
    [accept, onChange, syncInput, withAdded],
  );

  // 一覧から外したファイルは input からも外す。外さないと送信に残る。
  // コードから files を書き換えても input イベントは出ないので、自分で出して
  // @k8ordo/form などの form 側に知らせる
  const onFileDelete = useCallback(
    (fileId: string) => {
      const updatedFiles = acceptedFiles.filter((f) => f.id !== fileId);
      setAcceptedFiles(updatedFiles);
      const list = syncInput(updatedFiles);
      inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
      onChange?.(list);
    },
    [acceptedFiles, onChange, syncInput],
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
      onFilesDrop,
      openFilePicker,
    }),
    [
      disabledResolved,
      invalid,
      acceptedFiles,
      onFileDelete,
      onFilesDrop,
      openFilePicker,
    ],
  );

  return (
    <FileFieldProvider value={contextValue}>
      <div className="w-full">
        <input
          {...rest}
          accept={accept}
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

export const Trigger: FC<{
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

// フォルダーは中身を辿らないとファイルにならないので、ドロップでは受けない
// （フォルダーは webkitDirectory のピッカーで選ぶ）
const droppedFiles = (event: DragEvent<HTMLElement>): File[] =>
  Array.from(event.dataTransfer.items).flatMap((item) => {
    if (item.kind !== 'file' || item.webkitGetAsEntry()?.isDirectory === true) {
      return [];
    }
    const file = item.getAsFile();
    return file === null ? [] : [file];
  });

export const Dropzone: FC<{ children?: ReactNode }> = ({ children }) => {
  const messages = getMessages();
  const { disabled, invalid, onFilesDrop, openFilePicker } =
    useFileFieldContext();
  // 子要素の上を通るたびに dragleave / dragenter が対で届くので、入った深さで数える
  const [depth, setDepth] = useState(0);
  const isDragging = depth > 0 && !disabled;

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border-base bg-bg-base p-6 text-center transition-colors',
        invalid && 'border-border-error',
        isDragging && 'border-primary-border bg-primary-bg-subtle',
        disabled && 'cursor-not-allowed border-border-mute bg-bg-mute',
      )}
      data-dragging={isDragging ? '' : undefined}
      onDragEnter={(event) => {
        event.preventDefault();
        setDepth((current) => current + 1);
      }}
      onDragLeave={() => {
        setDepth((current) => Math.max(current - 1, 0));
      }}
      // 無効でも既定の動作は止める。止めないとブラウザがファイルを開いてページを離れる
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDepth(0);
        if (!disabled) {
          onFilesDrop(droppedFiles(event));
        }
      }}
    >
      {children ?? (
        <>
          <p className="text-fg-mute text-sm">{messages.fileFieldDrop}</p>
          <Button
            disabled={disabled}
            onClick={openFilePicker}
            size="sm"
            variant="outline"
          >
            {messages.fileFieldTrigger}
          </Button>
        </>
      )}
    </div>
  );
};

export const ItemList: FC<{
  showWebkitRelativePath?: boolean;
  clearable?: boolean;
}> = ({ showWebkitRelativePath, clearable }) => {
  const messages = getMessages();
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
