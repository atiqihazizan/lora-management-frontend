import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineSave } from "react-icons/md";
import { useMapContext } from '../../utils/useContexts';
import { useDrag } from 'react-dnd';

// Base CustomButton component
const CustomButton = forwardRef(({ 
  onClick, 
  className = "", 
  title,
  icon: Icon,
  style,
  isActive = false,
  ...args
}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`absolute z-[400] bg-white rounded-md shadow-lg p-[0.60rem] border-2 border-gray-400 hover:bg-gray-100 ${className}`}
      title={title}
      style={style}
      {...args}
    >
      {typeof Icon === 'function' ? <Icon className="w-6 h-6 text-gray-600" /> : Icon}
    </button>
  );
});

CustomButton.displayName = 'CustomButton';

CustomButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.element
  ]).isRequired,
  style: PropTypes.object,
  isActive: PropTypes.bool
};

// CenterButton component
export const CenterButton = ({ onClick, className = "" }) => {
  return (
    <CustomButton
      onClick={onClick}
      className={`${className} bottom-16 left-[10px]`}
      title="Center Map"
      icon={FaLocationCrosshairs}
    />
  );
};

CenterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

// ToggleButton component
export const ToggleButton = ({ onClick, className = "", isActive = false }) => {
  return (
    <CustomButton
      onClick={onClick}
      className={className}
      title="Toggle Drawing Tools"
      icon={FaPencilAlt}
      isActive={isActive}
    />
  );
};

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool
};

// SaveButton component
export const SaveButton = ({ onClick, className = "" }) => {
  return (
    <CustomButton
      onClick={onClick}
      className={`${className} !p-[0.15rem] !rounded-[4px]`}
      title="Save Changes"
      icon={MdOutlineSave}
    />
  );
};

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

// DeviceButton component
export const DeviceButton = ({ name, data, onClick, className = "", icon, style }) => {
  const { setIsDragging } = useMapContext();
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "point",
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }), [data]);

  return (
    <CustomButton
      ref={dragRef}
      onClick={onClick}
      className={`${className} !p-[0.35rem] !rounded-[4px] !text-lg ${isDragging ? "opacity-50" : "opacity-100"}`}
      title={name}
      icon={icon}
      style={style}
      onDrag={() => setIsDragging(true)}
    />
  );
};

DeviceButton.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.element
  ]).isRequired,
  style: PropTypes.object
};
