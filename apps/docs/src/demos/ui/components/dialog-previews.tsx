'use client';

import { Button, Dialog, Modal } from '@k8ordo/ui';
import { useState } from 'react';

export function DialogBasicPreview() {
  return (
    <Dialog.Root>
      <Dialog.Header onClose={() => {}} title="Dialog Title" />
      <Dialog.Content>Dialog content here</Dialog.Content>
    </Dialog.Root>
  );
}

export function DialogWithModalPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Dialog
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side="center"
      >
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              setIsOpen(false);
            }}
            title="Confirmation"
          />
          <Dialog.Content>
            <p>Are you sure you want to proceed?</p>
          </Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
}

export function AlertDialogPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Delete Item
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side="center"
      >
        <Dialog.Root role="alertdialog">
          <Dialog.Header
            onClose={() => {
              setIsOpen(false);
            }}
            title="Delete Confirmation"
          />
          <Dialog.Content>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  color="base"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
}
