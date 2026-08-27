'use client';

import { useEffect, useMemo, useRef } from 'react';
import type {
  FC,
  KeyboardEvent,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { mergeRefs } from '../../../helpers/merge-refs';
import { useControllableState } from '../../../hooks/controllable-state';
import { useMessages } from '../../../i18n/context';
import { FOCUS_RING, FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { SendIcon } from '../../icons';
import type { ChatStatus } from '../types';

const [PromptInputProvider, usePromptInputContext] = createSafeContext<{
  value: string;
  setValue: (value: string) => void;
  status: ChatStatus;
  stop: () => void;
}>(
  'PromptInput.Textarea / PromptInput.Submit must be used within <PromptInput.Root>',
);

const resizeToContent = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight.toString()}px`;
};

type RootProps = {
  status?: ChatStatus;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (message: string) => void;
  onStop?: () => void;
  children: ReactNode;
};

const Root: FC<RootProps> = ({
  status = 'ready',
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onStop,
  children,
}) => {
  const isControlled = value !== undefined;
  const [text, setText] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  });

  const contextValue = useMemo(
    () => ({
      value: text,
      setValue: setText,
      status,
      stop: () => onStop?.(),
    }),
    [text, setText, status, onStop],
  );

  return (
    <PromptInputProvider value={contextValue}>
      <form
        className={cn(
          'flex items-end gap-2 rounded-2xl border border-border-base bg-bg-base p-2',
          FOCUS_RING_WITHIN,
        )}
        onSubmit={(event) => {
          event.preventDefault();
          if (status === 'submitted' || status === 'streaming') {
            return;
          }
          const trimmed = text.trim();
          if (trimmed === '') {
            return;
          }
          onSubmit?.(trimmed);
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

const Textarea: FC<TextareaProps> = ({
  placeholder,
  onKeyDown,
  ref,
  ...rest
}) => {
  const { value, setValue, status } = usePromptInputContext();
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMemo(() => mergeRefs(innerRef, ref), [ref]);

  useEffect(() => {
    if (innerRef.current) {
      resizeToContent(innerRef.current);
    }
  }, [value]);

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
    if (status !== 'submitted' && status !== 'streaming') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <textarea
      {...rest}
      className={cn(
        'max-h-48 min-h-10 flex-1 resize-none bg-transparent text-fg-base outline-hidden p-2',
        'placeholder:text-fg-subtle',
      )}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      ref={mergedRef}
      rows={1}
      value={value}
    />
  );
};

type SubmitProps = {
  sendLabel?: string;
  stopLabel?: string;
};

const Submit: FC<SubmitProps> = ({ sendLabel, stopLabel }) => {
  const messages = useMessages();
  const { value, status, stop } = usePromptInputContext();
  const isBusy = status === 'submitted' || status === 'streaming';

  if (isBusy) {
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
      disabled={value.trim() === ''}
      type="submit"
    >
      <SendIcon size="sm" />
    </button>
  );
};

export const PromptInput = { Root, Textarea, Submit } as const;
