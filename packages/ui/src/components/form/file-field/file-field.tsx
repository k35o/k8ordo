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

const toAccepted = (files: readonly File[]): AcceptedFile[] =>
  files.map((file) => ({ file, id: crypto.randomUUID() }));

const toFileList = (files: readonly File[]) => {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
};

// コードから files を書き換えても input イベントは出ないので、自分で出して
// @k8ordo/form などの form 側に知らせる。列が変わらないときは出さない
const announce = (input: HTMLInputElement, files: readonly File[]) => {
  const current = Array.from(input.files ?? []);
  if (
    current.length === files.length &&
    current.every((file, index) => file === files[index])
  ) {
    return;
  }
  input.files = toFileList(files);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

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

  const defaultFiles = Array.isArray(defaultValue) ? defaultValue : [];
  const [acceptedFiles, setAcceptedFiles] = useState(() =>
    toAccepted(defaultFiles),
  );

  // files は属性で渡せないので、既定のファイルは描いたあとに書く
  const writeDefaults = useEffectEvent(() => {
    if (inputRef.current !== null) {
      inputRef.current.files = toFileList(defaultFiles);
    }
  });
  // form の reset は files を空にするが、change は飛ばないので一覧が取り残される
  const resetList = useEffectEvent(() => {
    setAcceptedFiles(toAccepted(defaultFiles));
  });

  useEffect(() => {
    writeDefaults();
    const form = inputRef.current?.form;
    if (!form) {
      return undefined;
    }
    const listener = () => {
      resetList();
      // ブラウザが files を空にするのはこのイベントのあとなので、
      // 既定のファイルはそれを待ってから書き戻す
      setTimeout(() => {
        writeDefaults();
      }, 0);
    };
    form.addEventListener('reset', listener);
    return () => {
      form.removeEventListener('reset', listener);
    };
  }, []);

  const withAdded = useCallback(
    (files: readonly File[]): AcceptedFile[] => {
      const added = toAccepted(files);
      return multiple || webkitDirectory
        ? [...acceptedFiles, ...added].slice(
            0,
            maxFiles ?? Number.POSITIVE_INFINITY,
          )
        : added.slice(0, 1);
    },
    [acceptedFiles, multiple, maxFiles, webkitDirectory],
  );

  // ブラウザは選び直すたびに files を新しく選んだ分だけに置き換えるので、
  // 積み上げた一覧と同じ列を書き戻す
  const onFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const updatedFiles = withAdded(Array.from(input.files ?? []));
      setAcceptedFiles(updatedFiles);
      announce(
        input,
        updatedFiles.map(({ file }) => file),
      );
      onChange?.(input.files, event);
    },
    [onChange, withAdded],
  );

  // ドロップと一覧からの削除は input を通らないので、送る列を input に書いて知らせる
  const commitFiles = useCallback(
    (updatedFiles: AcceptedFile[]) => {
      setAcceptedFiles(updatedFiles);
      const input = inputRef.current;
      if (input === null) {
        return;
      }
      announce(
        input,
        updatedFiles.map(({ file }) => file),
      );
      onChange?.(input.files);
    },
    [onChange],
  );

  const onFilesDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        commitFiles(withAdded(files));
      }
    },
    [commitFiles, withAdded],
  );

  const onFileDelete = useCallback(
    (fileId: string) => {
      commitFiles(acceptedFiles.filter((f) => f.id !== fileId));
    },
    [acceptedFiles, commitFiles],
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
