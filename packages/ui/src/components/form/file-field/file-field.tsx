'use client';

import { clsx } from 'clsx';
import type {
  ChangeEvent,
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

import { getMessages } from '../../../i18n/current';
import { acceptsFile } from '../../../internal/accepts-file';
import { carriesFiles } from '../../../internal/carries-files';
import { droppedFiles } from '../../../internal/dropped-files';
import { Button } from '../../buttons/button';
import { IconButton } from '../../buttons/icon-button';
import { XIcon } from '../../icons/x';
import { createSafeContext } from './../../../helpers/create-safe-context';
import { mergeRefs } from './../../../helpers/merge-refs';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './file-field.module.css';

type AcceptedFile = {
  file: File;
  id: string;
};

type FileFieldContext = {
  disabled: boolean;
  invalid: boolean;
  labelledBy: string | undefined;
  describedBy: string | undefined;
  setTrigger: (node: HTMLElement | null) => void;
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
    defaultValue?: File[];
    // event はファイル選択（input の change）時に渡る。ドロップや一覧からの
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
  onFocus,
  ...rest
}: RootProps) => {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  // 参照が変わるたびに React が ref の解除と再設定を行うため、
  // 利用者が副作用付きのコールバック ref を渡しても毎レンダー走らないようにする
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;

  const defaultFiles = defaultValue ?? [];
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

  // ブラウザが accept を当てるのは選択ダイアログだけなので、ドロップで届いた
  // ファイルはここで選り分ける
  const onFilesDrop = useCallback(
    (files: File[]) => {
      const taken =
        accept === undefined
          ? files
          : files.filter((file) => acceptsFile(file, accept));
      if (taken.length > 0) {
        commitFiles(withAdded(taken));
      }
    },
    [accept, commitFiles, withAdded],
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

  const setTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const labelledBy = rest['aria-labelledby'];
  const describedBy = rest['aria-describedby'];
  const contextValue = useMemo(
    () => ({
      disabled: disabledResolved,
      invalid,
      labelledBy,
      describedBy,
      setTrigger,
      acceptedFiles,
      onFileDelete,
      onFilesDrop,
      openFilePicker,
    }),
    [
      disabledResolved,
      invalid,
      labelledBy,
      describedBy,
      setTrigger,
      acceptedFiles,
      onFileDelete,
      onFilesDrop,
      openFilePicker,
    ],
  );

  return (
    <FileFieldProvider value={contextValue}>
      <div className={styles.root}>
        <input
          {...rest}
          accept={accept}
          aria-hidden
          aria-invalid={invalid}
          className={srOnly.srOnly}
          disabled={disabledResolved}
          id={rest.id ?? generatedId}
          multiple={multiple}
          onChange={onFilesChange}
          // フォーカスを受けられるまま残すのは、form が送信に失敗した欄へ移す
          // フォーカスを、押す Trigger へ送るため
          onFocus={(event) => {
            onFocus?.(event);
            triggerRef.current?.focus();
          }}
          ref={mergedRef}
          required={required}
          tabIndex={-1}
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

const useTriggerWiring = () => {
  const id = useId();
  const { labelledBy, describedBy, setTrigger, openFilePicker, disabled } =
    useFileFieldContext();
  return {
    id,
    'aria-labelledby':
      labelledBy === undefined ? undefined : `${labelledBy} ${id}`,
    'aria-describedby': describedBy,
    ref: setTrigger,
    onClick: openFilePicker,
    disabled,
  };
};

export const Trigger: FC<{
  renderItem: (props: {
    id: string;
    'aria-labelledby': string | undefined;
    'aria-describedby': string | undefined;
    ref: (node: HTMLElement | null) => void;
    onClick: () => void;
    disabled: boolean;
  }) => ReactElement;
}> = ({ renderItem }) => renderItem(useTriggerWiring());

export const Dropzone: FC<{ children?: ReactNode }> = ({ children }) => {
  const messages = getMessages();
  const wiring = useTriggerWiring();
  const { disabled, invalid, onFilesDrop } = useFileFieldContext();
  // 子要素の上を通るたびに dragleave / dragenter が対で届くので、入った深さで数える
  const [depth, setDepth] = useState(0);
  const isDragging = depth > 0 && !disabled;

  return (
    <div
      className={clsx(
        styles.dropzone,
        invalid && styles.invalid,
        isDragging && styles.dragging,
        disabled && styles.disabled,
      )}
      data-dragging={isDragging ? '' : undefined}
      onDragEnter={(event) => {
        if (!carriesFiles(event.dataTransfer)) {
          return;
        }
        event.preventDefault();
        setDepth((current) => current + 1);
      }}
      onDragLeave={(event) => {
        if (!carriesFiles(event.dataTransfer)) {
          return;
        }
        setDepth((current) => Math.max(current - 1, 0));
      }}
      // 無効でも既定の動作は止める。止めないとブラウザがファイルを開いてページを離れる
      onDragOver={(event) => {
        if (!carriesFiles(event.dataTransfer)) {
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
      }}
      onDrop={(event) => {
        if (!carriesFiles(event.dataTransfer)) {
          return;
        }
        event.preventDefault();
        setDepth(0);
        if (!disabled) {
          onFilesDrop(droppedFiles(event.dataTransfer));
        }
      }}
    >
      {children ?? (
        <>
          <p className={styles.hint}>{messages.fileFieldDrop}</p>
          <Button {...wiring} size="sm" variant="outline">
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
    <ul className={styles.list}>
      {acceptedFiles.map((acceptedFile) => {
        const { file, id } = acceptedFile;
        const onDelete = () => {
          onFileDelete(id);
        };

        const sizeInKB = (file.size / 1024).toFixed(2);

        return (
          <li className={styles.item} key={id}>
            <div className={styles.meta}>
              <span className={styles.name}>
                {showWebkitRelativePath === true
                  ? file.webkitRelativePath
                  : file.name}
              </span>
              <span className={styles.size}>{sizeInKB} KB</span>
            </div>
            {clearable === true && (
              <IconButton label={messages.fileFieldRemove} onClick={onDelete}>
                <XIcon size="sm" />
              </IconButton>
            )}
          </li>
        );
      })}
    </ul>
  );
};
