import { FC, ReactNode } from 'react';
import { Modal, ModalProps } from '../../AntCustom';
import { IconWarning } from './IconWarning';
import './styles.css';

export type Props = Omit<ModalProps, 'okText' | 'cancelText' | 'children'> & {
  title: ReactNode;
  description: ReactNode;
};

export const ModalDelete: FC<Props> = ({ title, description, ...props }) => {
  return (
    <Modal {...props} title={null}>
      <div className="ModalDelete__container">
        <div className="ModalDelete__icon">
          <IconWarning />
        </div>
        <div>
          <p className="ModalDelete__title">{title}</p>
          <p className="ModalDelete__description">{description}</p>
        </div>
      </div>
    </Modal>
  );
};
