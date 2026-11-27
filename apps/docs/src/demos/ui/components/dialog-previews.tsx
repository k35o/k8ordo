'use client';

import { Button, Dialog } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './dialog-previews.module.css';

export function DialogBasicPreview() {
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
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Confirmation"
      >
        <p>Are you sure you want to proceed?</p>
      </Dialog>
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
      <Dialog
        description="This action cannot be undone."
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        role="alertdialog"
        title="Delete this item?"
      >
        <div className={styles.actions}>
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
      </Dialog>
    </>
  );
}

export function DialogBottomPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Sheet
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side="bottom"
        title="Share"
      >
        <p>Slides up from the bottom of the screen.</p>
      </Dialog>
    </>
  );
}

export function DialogLabelPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Notice
      </Button>
      <Dialog
        isOpen={isOpen}
        label="Notice"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className={styles.body}>
          <p>The maintenance starts at 22:00.</p>
          <div className={styles.actions}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
