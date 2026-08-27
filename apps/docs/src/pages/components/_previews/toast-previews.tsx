'use client';

import { Button, ToastProvider, useToast } from '@k8ordo/ui';

function ToastDemo() {
  const { open } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        color="primary"
        onClick={() => {
          open('success', 'Operation completed successfully');
        }}
      >
        Success
      </Button>
      <Button
        color="base"
        onClick={() => {
          open('info', 'Here is some information');
        }}
      >
        Info
      </Button>
      <Button
        color="base"
        onClick={() => {
          open('warning', 'Please check your input');
        }}
      >
        Warning
      </Button>
      <Button
        color="base"
        onClick={() => {
          open('error', 'Something went wrong');
        }}
      >
        Error
      </Button>
    </div>
  );
}

function CloseAllDemo() {
  const { open, closeAll } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        color="base"
        onClick={() => {
          open('info', 'Notification 1');
        }}
      >
        Add Toast
      </Button>
      <Button
        color="base"
        onClick={() => {
          open('success', 'Notification 2');
        }}
      >
        Add Another
      </Button>
      <Button color="primary" onClick={closeAll}>
        Close All
      </Button>
    </div>
  );
}

export function ToastBasicPreview() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}

export function ToastCloseAllPreview() {
  return (
    <ToastProvider>
      <CloseAllDemo />
    </ToastProvider>
  );
}
