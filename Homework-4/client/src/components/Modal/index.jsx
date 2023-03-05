import { Modal, Portal } from '@mantine/core';

export function EditModal({ opened, setOpened, title, content }) {
  return (
    <Portal>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
      >
        {content}
      </Modal>
    </Portal>
  );
}