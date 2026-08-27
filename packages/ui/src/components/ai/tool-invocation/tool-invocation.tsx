'use client';

import type { FC, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { Spinner } from '../../feedback/spinner';
import { AlertIcon, CheckIcon } from '../../icons';
import { Collapsible } from '../_internal/collapsible';
import type { ToolState } from '../types';

type Props = {
  name: string;
  state: ToolState;
  input?: unknown;
  output?: ReactNode;
  errorText?: string;
  deniedReason?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
};

const stateIcon = (state: ToolState): ReactNode => {
  if (state === 'output-available') {
    return (
      <span className="text-fg-success">
        <CheckIcon size="sm" />
      </span>
    );
  }
  if (state === 'output-error') {
    return (
      <span className="text-fg-error">
        <AlertIcon size="sm" status="error" />
      </span>
    );
  }
  if (state === 'output-denied') {
    return (
      <span className="text-fg-warning">
        <AlertIcon size="sm" status="warning" />
      </span>
    );
  }
  return <Spinner size="sm" />;
};

const stringify = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const ToolInvocation: FC<Props> = ({
  name,
  state,
  input,
  output,
  errorText,
  deniedReason,
  isOpen,
  defaultOpen = false,
  onChange,
}) => {
  const messages = useMessages();

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      icon={stateIcon(state)}
      isOpen={isOpen}
      label={<span className="text-fg-base font-medium">{name}</span>}
      onChange={onChange}
    >
      <div className="flex flex-col gap-3">
        {input !== undefined && (
          <div>
            <p className="text-fg-mute mb-1 text-xs font-medium">
              {messages.toolInput}
            </p>
            <pre className="bg-bg-mute text-fg-base overflow-x-auto rounded-lg p-2 text-xs">
              {stringify(input)}
            </pre>
          </div>
        )}
        {state === 'output-error' ? (
          <p className="text-fg-error text-sm">
            {errorText ?? messages.toolError}
          </p>
        ) : state === 'output-denied' ? (
          <p className="text-fg-warning text-sm">
            {deniedReason ?? messages.toolDenied}
          </p>
        ) : output === undefined ? null : (
          <div>
            <p className="text-fg-mute mb-1 text-xs font-medium">
              {messages.toolOutput}
            </p>
            {typeof output === 'string' ? (
              <pre className="bg-bg-mute text-fg-base overflow-x-auto rounded-lg p-2 text-xs">
                {output}
              </pre>
            ) : (
              output
            )}
          </div>
        )}
      </div>
    </Collapsible>
  );
};
