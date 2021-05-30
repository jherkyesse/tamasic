import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdArrowDropdown } from 'react-icons/io';

const defaultAccordionClassName = 'flex flex-1 justify-between items-center';

const defaultIconButtonClassName =
  'bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded cursor-pointer';

const collapseChildrenClassNameMap = {
  true: 'h-0 overflow-hidden',
  false: '',
};

const collapseIconClassNameMap = {
  true: 'rotate-180 transform transition duration-300',
  false: 'rotate-0 transform transition duration-300',
};

type AccordionProps = {
  children?: string | React.ReactChildren | React.ReactNode;
  className?: string;
  header?: string | React.ReactChildren | React.ReactNode;
  iconSize?: number;
  isDefaultCollapse?: boolean;
};

const Accordion = ({ children, className, header, iconSize, isDefaultCollapse }: AccordionProps) => {
  const [isCollapse, setIsCollapse] = useState(isDefaultCollapse);
  const onToggle = () => setIsCollapse(!isCollapse);

  return (
    <>
      <div className={`${defaultAccordionClassName} ${className}`}>
        {header}
        <div className={defaultIconButtonClassName} onClick={onToggle} onKeyDown={null} role="presentation">
          <IoMdArrowDropdown className={collapseIconClassNameMap[String(isCollapse)]} size={iconSize} />
        </div>
      </div>
      <div className={collapseChildrenClassNameMap[String(isCollapse)]}>{children}</div>
    </>
  );
};

Accordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconSize: PropTypes.number,
  isDefaultCollapse: PropTypes.bool,
};

Accordion.defaultProps = {
  children: null,
  className: '',
  header: '',
  iconSize: 20,
  isDefaultCollapse: false,
};

export default Accordion;
