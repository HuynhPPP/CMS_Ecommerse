import { Modal, type ModalProps } from 'antd';
import React from 'react';

type AppModalProps = ModalProps & {
  bg?: string;
};

const AppModal: React.FC<AppModalProps> = ({ children, ...rest }) => {
  return (
    <Modal centered destroyOnHidden maskClosable={false} mask={true} {...rest}>
      {children}
    </Modal>
  );
};

export default AppModal;
