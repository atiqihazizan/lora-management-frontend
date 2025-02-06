import React from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import PropTypes from 'prop-types';

const CenterButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute z-[400] bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 ${className}`}
      title="Center Map"
    >
      <FaLocationCrosshairs className="w-6 h-6 text-gray-600" />
    </button>
  );
};

CenterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default CenterButton;