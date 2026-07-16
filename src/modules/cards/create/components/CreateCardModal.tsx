'use client';

import { App, Modal } from 'antd';

import { useCreateCard } from '@/shared/hooks/api/mutations/cards/useCreateCard';

import type { CreateCardFormValues } from '../schemas/create-card-schema';

import CreateCardForm from './CreateCardForm';

interface CreateCardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateCardModal({ open, onClose }: CreateCardModalProps) {
  const { message } = App.useApp();
  const { mutate, isPending } = useCreateCard();

  const handleSubmit = (values: CreateCardFormValues) => {
    mutate(values, {
      onSuccess: () => {
        message.success('Card added');
        onClose();
      },
      onError: () => {
        message.error('Could not add the card. Check the details and try again.');
      },
    });
  };

  return (
    <Modal title="Add a card" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <CreateCardForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </Modal>
  );
}
