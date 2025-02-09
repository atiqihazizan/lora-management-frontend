import PropTypes from "prop-types";
import { useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange = () => {},
  error,
  required = false,
  inputClassName = "",
  labelClassName = "",
  groupClassName = "",
  accept = "",
  onClear = null,
  disabled = false,
}) => {
  const fileinputRef = useRef(null);

  const handleClearFile = () => {
    if(onClear) onClear();
    if (fileinputRef.current) {
      fileinputRef.current.value = "";
    }
  };

  const inputProps = {
    id,
    type,
    placeholder,
    value: value || "",
    onChange,
    disabled,
    className: `w-full px-4 py-2 border ${
      error ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-blue-500"
    } focus:border-transparent ${
      disabled ? "bg-gray-100 cursor-not-allowed" : ""
    } ${inputClassName}`
  };

  return (
    <div className={`form-group ${groupClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-600 mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {type === "file" ? (
        <div className="relative flex items-center">
          <input
            {...inputProps}
            ref={fileinputRef}
            accept={accept}
          />
          {value && onClear && !disabled && (
            <button
              type="button"
              onClick={handleClearFile}
              className="text-red-500 hover:text-red-700 absolute right-2">
              <XCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <input {...inputProps} />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  groupClassName: PropTypes.string,
  accept: PropTypes.string,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
};

export default InputField;
