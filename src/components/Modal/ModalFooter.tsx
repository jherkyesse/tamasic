import React, { ReactChildren } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

let defaultModalFooterClassName = 'float-right p-2';

type ModalFooterProps = {
  cancelLabel: string;
  confirmLabel: string;
  children?: ReactChildren;
  className?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ModalFooter({
  cancelLabel,
  confirmLabel,
  children,
  className,
  onCancel,
  onConfirm,
}: ModalFooterProps) {
  return (
    <div className={`${defaultModalFooterClassName} ${className}`}>
      {children ? (
        children
      ) : (
        <>
          <Button color="red" onClick={onCancel} className="mr-2">{cancelLabel}</Button>
          <Button color="green" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      )}
    </div>
  );
}

ModalFooter.propTypes = {
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

ModalFooter.defaultProps = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  className: '',
  children: null,
  onCancel: () => {},
  onConfirm: () => {},
};

export default ModalFooter;
