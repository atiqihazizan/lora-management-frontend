import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Create context
const DropdownContext = createContext();

// Custom hook untuk access dropdown context
export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};

// Dropdown Provider Component
export const DropdownProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const select = (item) => {
    setSelectedItem(item);
    close();
  };

  return (
    <DropdownContext.Provider value={{ isOpen, selectedItem, toggle, close, select, dropdownRef }}>
      <div ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

DropdownProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Dropdown Button Component
export const DropdownButton = ({ 
  icon: Icon, 
  label, 
  className = "", 
  showArrow = false,
  background = "hover:bg-gray-100"
}) => {
  const { isOpen, toggle } = useDropdown();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 text-gray-700 rounded-md ${background} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {label}
      {showArrow && (
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
  );
};

DropdownButton.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  showArrow: PropTypes.bool,
  background: PropTypes.string,
};

// Dropdown Menu Component
export const DropdownMenu = ({ children, align = 'right' }) => {
  const { isOpen, dropdownRef } = useDropdown();

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'right']),
};

// Dropdown Item Component
export const DropdownItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  href,
  disabled = false,
  type = 'button'
}) => {
  const { close } = useDropdown();

  const commonClasses = `
    group flex w-full items-center px-4 py-2 text-sm text-gray-700
    ${disabled 
      ? 'cursor-not-allowed opacity-50' 
      : 'hover:bg-gray-100 hover:text-gray-900'
    }
  `;

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick();
    close();
  };

  const content = (
    <>
      {Icon && <Icon className="mr-3 h-5 w-5" />}
      {label}
    </>
  );

  if (type === 'link' && href) {
    return (
      <Link to={href} className={commonClasses} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={commonClasses}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

DropdownItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'link', 'both']),
};

// Main Dropdown Component
export const Dropdown = ({ children }) => {
  return (
    <DropdownProvider>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownProvider>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};

// Usage Example:
/*
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from './Dropdown';
import { FaCog, FaTrash, FaUpload } from 'react-icons/fa';

function Example() {
  return (
    <Dropdown>
      <DropdownButton icon={FaCog} label="Options" />
      <DropdownMenu>
        <DropdownItem 
          icon={FaUpload} 
          label="Upload" 
          onClick={() => console.log('Upload')} 
        />
        <DropdownItem 
          icon={FaTrash} 
          label="Delete" 
          onClick={() => console.log('Delete')} 
        />
      </DropdownMenu>
    </Dropdown>
  );
}*/