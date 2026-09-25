'use client';

import { useId, useTransition } from 'react';
import type { FC, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { Button } from '../../buttons/button';
import { Spinner } from '../../feedback/spinner';
import { AlertIcon, CheckIcon } from '../../icons';
import { Collapsible } from '../_internal/collapsible';
import type { ToolApproval, ToolApprovalResponse, ToolState } from '../types';

type Props = {
  name: string;
  state: ToolState;
  input?: unknown;
  output?: ReactNode;
  errorText?: string;
  approval?: ToolApproval;
  // AI SDK の addToolApprovalResponse は PromiseLike を返すので、Promise に
  // 狭めるとそのまま渡せなくなる。
  onApprovalResponse?: (
    response: ToolApprovalResponse,
  ) => void | PromiseLike<void>;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
};

const stateIcon = (state: ToolState, awaitsUser: boolean): ReactNode => {
  if (awaitsUser) {
    return (
      <span className="text-fg-info">
        <AlertIcon size="sm" status="info" />
      </span>
    );
  }
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
  approval,
  onApprovalResponse,
  isOpen,
  defaultOpen = false,
  onChange,
}) => {
  const messages = useMessages();
  const nameId = useId();
  const [isResponding, startTransition] = useTransition();
  const pendingApproval =
    state === 'approval-requested' && approval?.isAutomatic !== true
      ? approval
      : undefined;

  const respond = (id: string, approved: boolean) => {
    startTransition(async () => {
      await onApprovalResponse?.({ id, approved });
    });
  };

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      icon={stateIcon(state, pendingApproval !== undefined)}
      isOpen={isOpen}
      label={
        <span className="text-fg-base font-medium" id={nameId}>
          {name}
        </span>
      }
      onChange={onChange}
      footer={
        pendingApproval === undefined ? undefined : (
          <div
            aria-labelledby={nameId}
            className="flex flex-wrap items-center gap-2"
            role="group"
          >
            <p className="text-fg-base min-w-0 flex-1 text-sm">
              {pendingApproval.requestReason ?? messages.toolApprovalRequest}
            </p>
            {onApprovalResponse !== undefined && (
              <div className="flex shrink-0 gap-2">
                <Button
                  color="base"
                  disabled={isResponding}
                  onClick={() => {
                    respond(pendingApproval.id, false);
                  }}
                  size="sm"
                  variant="outline"
                >
                  {messages.toolDeny}
                </Button>
                <Button
                  disabled={isResponding}
                  onClick={() => {
                    respond(pendingApproval.id, true);
                  }}
                  size="sm"
                >
                  {messages.toolApprove}
                </Button>
              </div>
            )}
          </div>
        )
      }
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
            {approval?.reason ?? messages.toolDenied}
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
