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
  onClear = null, // Fungsi untuk kosongkan input file
}) => {
  const fileinputRef = useRef(null);

  const handleClearFile = () => {
    if(onClear) onClear();
    if (fileinputRef.current) {
      fileinputRef.current.value = ""; // Kosongkan nilai input file
    }
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

      {/* Input File */}
      {type === "file" ? (
        <div className="relative flex items-center">
          <input
            ref={fileinputRef}
            id={id}
            type="file"
            onChange={onChange}
            accept={accept}
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent ${inputClassName}`}
          />
          {/* Paparkan nama fail */}
          {/* {value && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600">
                Selected file: {value.name}
              </p>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-red-500 hover:text-red-700">
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )} */}
          {value && onClear && (
            <button
              type="button"
              onClick={handleClearFile}
              className="text-red-500 hover:text-red-700 absolute right-2">
              <XCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        // Input biasa
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent ${inputClassName}`}
        />
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// InputField.propTypes = {
//   id: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   type: PropTypes.string,
//   placeholder: PropTypes.string,
//   value: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.number,
//     PropTypes.object,
//   ]), // Tambah `object` untuk file
//   onChange: PropTypes.func,
//   error: PropTypes.string,
//   required: PropTypes.bool,
//   inputClassName: PropTypes.string,
//   labelClassName: PropTypes.string,
//   groupClassName: PropTypes.string,
//   accept: PropTypes.string, // Untuk menentukan jenis fail yang dibenarkan
// };

export default InputField;
