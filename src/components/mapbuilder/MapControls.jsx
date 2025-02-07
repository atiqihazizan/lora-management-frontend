import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FaLocationCrosshairs, FaMapPin } from "react-icons/fa6";
import { MdOutlineSave, MdSensors } from "react-icons/md";
import { useMapContext } from '../../utils/useContexts';
import { useDrag } from 'react-dnd';
import { BsPinMap } from 'react-icons/bs';

// Base CustomButton component
const CustomButton = forwardRef(({ 
  onClick =  () => {}, 
  className = "", 
  title,
  icon: Icon,
  style,
  isActive = false,
  label = null,
  ...args
}, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`absolute z-[400] bg-white rounded-md shadow-lg border-2 border-gray-400 hover:bg-gray-100 ${className}`}
      title={title}
      style={style}
      {...args}
    >
      {typeof Icon === 'function' ? <Icon className="w-6 h-6 text-gray-600" /> : Icon}
      {label}
    </button>
  );
});

CustomButton.displayName = 'CustomButton';

CustomButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.element
  ]).isRequired,
  style: PropTypes.object,
  isActive: PropTypes.bool,
  label: PropTypes.node
};

CustomButton.defaultProps = {
  title: "",
};

// CenterButton component
export const CenterButton = ({ onClick, className = "" }) => {
  return (
    <CustomButton
      onClick={onClick}
      className={`${className} bottom-16 left-[10px] p-[0.60rem]`}
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
export const ToggleButton = ({ onClick, className = "", isActive = false, label = null }) => {
  return (
    <CustomButton
      onClick={onClick}
      className={`p-[0.60rem] ${className}`}
      title="Toggle Drawing Tools"
      icon={isActive ? MdSensors : BsPinMap}
      isActive={isActive}
      label={label}
    />
  );
};

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  label: PropTypes.node
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
export const DeviceButton = ({ name, data, onClick, className = "", icon, style, label = null }) => {
  const { setIsDragging } = useMapContext();
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "point",
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }), [data]);

  return (
    <div className="absolute group" style={style}>
      <CustomButton
        ref={dragRef}
        onClick={onClick}
        className={`${className} p-[0.30rem] !rounded-[4px] !text-lg flex items-center  ${isDragging ? "opacity-50" : "opacity-100"}`}
        icon={icon}
        onDrag={() => setIsDragging(true)}
        label={
          label && (
            <span className="overflow-hidden max-w-0 whitespace-nowrap transition-all duration-300 ease-in-out text-sm group-hover:max-w-[200px] group-hover:ml-3">
              {label}
            </span>
          )
        }
      />
    </div>
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
  style: PropTypes.object,
  label: PropTypes.node
};
