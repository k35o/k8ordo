'use client';

import { Button, Dialog, Modal } from '@k8ordo/ui';
import { useState } from 'react';

export function ModalBasicPreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
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

export function ModalSidesPreview() {
  const [centerOpen, setCenterOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setCenterOpen(true);
        }}
      >
        Center
      </Button>
      <Button
        onClick={() => {
          setBottomOpen(true);
        }}
      >
        Bottom
      </Button>
      <Button
        onClick={() => {
          setRightOpen(true);
        }}
      >
        Right
      </Button>
      <Modal
        isOpen={centerOpen}
        onClose={() => {
          setCenterOpen(false);
        }}
        side="center"
      >
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              setCenterOpen(false);
            }}
            title="Center Modal"
          />
          <Dialog.Content>Centered on screen</Dialog.Content>
        </Dialog.Root>
      </Modal>
      <Modal
        isOpen={bottomOpen}
        onClose={() => {
          setBottomOpen(false);
        }}
        side="bottom"
      >
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              setBottomOpen(false);
            }}
            title="Bottom Modal"
          />
          <Dialog.Content>Slides up from bottom</Dialog.Content>
        </Dialog.Root>
      </Modal>
      <Modal
        isOpen={rightOpen}
        onClose={() => {
          setRightOpen(false);
        }}
        side="right"
      >
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              setRightOpen(false);
            }}
            title="Right Modal"
          />
          <Dialog.Content>Slides in from right</Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
}

export function DefaultOpenPreview() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setShow(true);
        }}
      >
        Show Default Open Modal
      </Button>
      {show && (
        <Modal
          defaultOpen
          onClose={() => {
            setShow(false);
          }}
          side="center"
        >
          <Dialog.Root>
            <Dialog.Header
              onClose={() => {
                setShow(false);
              }}
              title="Default Open Modal"
            />
            <Dialog.Content>
              <p>This modal is open by default.</p>
            </Dialog.Content>
          </Dialog.Root>
        </Modal>
      )}
    </>
  );
}
