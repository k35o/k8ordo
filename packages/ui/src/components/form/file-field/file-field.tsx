'use client';

import type {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactElement,
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
// @k8ordo/form などの form 側に知らせる
const announce = (input: HTMLInputElement, files: readonly File[]) => {
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

  // ブラウザは選び直すたびに files を新しく選んだ分だけに置き換えるので、
  // 積み上げた一覧と同じ列を書き戻す
  const onFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const picked = Array.from(input.files ?? []);
      const added = toAccepted(picked);
      const updatedFiles =
        multiple || webkitDirectory
          ? [...acceptedFiles, ...added].slice(
              0,
              maxFiles ?? Number.POSITIVE_INFINITY,
            )
          : added.slice(0, 1);
      setAcceptedFiles(updatedFiles);

      const files = updatedFiles.map(({ file }) => file);
      if (
        files.length !== picked.length ||
        files.some((file, index) => file !== picked[index])
      ) {
        announce(input, files);
      }
      onChange?.(input.files, event);
    },
    [acceptedFiles, multiple, maxFiles, onChange, webkitDirectory],
  );

  // 一覧から外したファイルは input からも外す。外さないと送信に残る
  const onFileDelete = useCallback(
    (fileId: string) => {
      const updatedFiles = acceptedFiles.filter((f) => f.id !== fileId);
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

export const ItemList: FC<{
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
