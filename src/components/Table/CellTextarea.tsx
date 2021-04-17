import React, { useState, useContext, useEffect, useRef } from 'react';
import {TableContext} from './TableContext';

const defaultClassName =
  'border border-red-900 absolute top-0 left-0 width-calc-full-2px height-calc-full-2px resize-none bg-white outline-none px-5px py-3px leading-5 -mt-1px -ml-1px z-10';

type CellTextareaProps = {
  value?: string;
  className?: string;
};

function CellTextarea({ value: defaultValue, className = '' }: CellTextareaProps) {
  const { isEdited } = useContext(TableContext);
  const [value, setValue] = useState(defaultValue);
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.textContent || '');
  };
  const focusClassName = isEdited ? 'cursor-text' : '';

  return (
    <>
      <div
        contentEditable={isEdited}
        suppressContentEditableWarning
        spellCheck={false}
        className={`${defaultClassName} ${focusClassName} ${className}`}
        onInput={onInput}
      >
        {defaultValue}
      </div>
    </>
  );
}

export default CellTextarea;
