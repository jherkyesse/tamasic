import React, { useState, useContext, useEffect, useRef } from 'react';
import {TableContext} from './TableContext';

const defaultClassName =
  'border border-red-900 absolute top-0 left-0 min-w-full min-h-full resize-none bg-white outline-none px-5px py-3px leading-5 mt--1px -mt-1px -ml-1px -mx-1px';

type CellTextareaProps = {
  value?: string;
};

function CellTextarea({ value: defaultValue }: CellTextareaProps) {
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
        className={`${defaultClassName} ${focusClassName}`}
        onInput={onInput}
      >
        {defaultValue}
      </div>
    </>
  );
}

export default CellTextarea;
