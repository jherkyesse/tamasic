import React from 'react';
import {
  FcDataSheet,
  FcAcceptDatabase,
  FcAddRow,
  FcAddColumn,
  FcDeleteRow,
  FcDeleteColumn,
  FcGrid,
} from 'react-icons/fc';
import { contextMenuIconSize } from './config';

const defaultClassName = 'absolute border border-gray-500 shadow bg-white z-20';
const menuClassName =
  'flex flex-nowrap items-center px-2 py-1 first:pr-2 border-b border-gray-200 text-xs bg-white hover:bg-gray-100 cursor-pointer';

type ContextMenuProps = {
  top: number;
  left: number;
  className?: string;
};

function ContextMenu({ top, left, className = '' }: ContextMenuProps) {
  return (
    <div className={`${defaultClassName} ${className}`} style={{ left, top }}>
      <div className={menuClassName}>
        <FcDataSheet size={contextMenuIconSize} />
        <span>Merge Cells</span>
      </div>
      <div className={menuClassName}>
        <FcGrid size={contextMenuIconSize} />
        <span>Unmerge Cells</span>
      </div>
      <div className={menuClassName}>
        <FcAddRow size={contextMenuIconSize} />
        <span>Add Row</span>
      </div>
      <div className={menuClassName}>
        <FcAddColumn size={contextMenuIconSize} />
        <span>Add Column</span>
      </div>
      <div className={menuClassName}>
        <FcDeleteRow size={contextMenuIconSize} />
        <span>Delete Column</span>
      </div>
      <div className={menuClassName}>
        <FcDeleteColumn size={contextMenuIconSize} />
        <span>Delete Column</span>
      </div>
    </div>
  );
}

export default ContextMenu;
