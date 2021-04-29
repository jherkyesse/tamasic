import React, { ReactChildren } from 'react';
import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';

const defaultModalBackdropClassName =
  'fixed inset-0 bg-opacity-60 bg-gray-300 w-full h-full flex justify-center items-center z-100';
const defaultModalClassName =
  'min-w-1/2 bg-white dark:bg-gray-900 rounded-sm shadow';

type ModalProps = {
  children?: ReactChildren | string | JSX.Element | JSX.Element[];
  isOpen?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
};

function Modal({ children, isOpen, onClose, onConfirm, title }: ModalProps) {
  const hidden = isOpen ? '' : 'hidden';
  return (
    <div className={`${defaultModalBackdropClassName} ${hidden}`}>
      <div className={defaultModalClassName}>
        <ModalHeader onClose={onClose}>{title}</ModalHeader>
        <div className="w-full p-2 border-t border-b border-gray-300">
          {children}
        </div>
        <ModalFooter onCancel={onClose} onConfirm={onConfirm} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  children: null,
  isOpen: false,
  title: '',
  onClose: () => {},
};

export default Modal;
