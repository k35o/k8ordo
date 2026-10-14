import { clsx } from 'clsx';
import { useId } from 'react';
import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { Spinner } from '../../feedback/spinner';
import { AlertIcon, CheckIcon } from '../../icons';
import { Collapsible } from '../_internal/collapsible';
import type { ToolApproval, ToolApprovalResponse, ToolState } from '../types';
import { ApprovalBar } from './approval-bar';

import styles from './tool-invocation.module.css';

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
      <span className={styles.info}>
        <AlertIcon size="sm" status="info" />
      </span>
    );
  }
  if (state === 'output-available') {
    return (
      <span className={styles.success}>
        <CheckIcon size="sm" />
      </span>
    );
  }
  if (state === 'output-error') {
    return (
      <span className={styles.error}>
        <AlertIcon size="sm" status="error" />
      </span>
    );
  }
  if (state === 'output-denied') {
    return (
      <span className={styles.warning}>
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
  const messages = getMessages();
  const nameId = useId();
  const triggerId = useId();
  const pendingApproval =
    state === 'approval-requested' && approval?.isAutomatic !== true
      ? approval
      : undefined;

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      icon={stateIcon(state, pendingApproval !== undefined)}
      isOpen={isOpen}
      label={
        <span className={styles.name} id={nameId}>
          {name}
        </span>
      }
      onChange={onChange}
      triggerId={triggerId}
      footer={
        pendingApproval === undefined ? undefined : (
          <ApprovalBar
            approval={pendingApproval}
            nameId={nameId}
            onApprovalResponse={onApprovalResponse}
            triggerId={triggerId}
          />
        )
      }
    >
      <div className={styles.body}>
        {input !== undefined && (
          <div>
            <p className={styles.caption}>{messages.toolInput}</p>
            <pre className={styles.code}>{stringify(input)}</pre>
          </div>
        )}
        {state === 'output-error' ? (
          <p className={clsx(styles.message, styles.error)}>
            {errorText ?? messages.toolError}
          </p>
        ) : state === 'output-denied' ? (
          <p className={clsx(styles.message, styles.warning)}>
            {approval?.reason ?? messages.toolDenied}
          </p>
        ) : output === undefined ? null : (
          <div>
            <p className={styles.caption}>{messages.toolOutput}</p>
            {typeof output === 'string' ? (
              <pre className={styles.code}>{output}</pre>
            ) : (
              output
            )}
          </div>
        )}
      </div>
    </Collapsible>
  );
};
