import React, { ReactChildren, ReactChild } from 'react';
import { GrClose } from 'react-icons/gr';
import Button from '../Button';

const defaultModalHeaderClassName =
  'flex flex-nowrap w-full justify-between text-lg p-2 ';

type HeaderProps = {
  children?: ReactChild;
  onClose: () => void;
};

function Header({ children, onClose }: HeaderProps) {
  return (
    <div className={defaultModalHeaderClassName}>
      <div>{children}</div>
      <Button icon={<GrClose size={18} onClick={onClose} />} />
    </div>
  );
}

export default Header;
