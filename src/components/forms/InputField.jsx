import PropTypes from 'prop-types';

const InputField = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange = () => { }, // Fallback fungsi kosong
  error,
  required = false,
  inputClassName = "", // Custom class untuk input
  labelClassName = "", // Custom class untuk label
  groupClassName = "", // Custom class untuk div group
}) => {
  if (type === "hidden") {
    // Jika tipe adalah hidden, langsung return input tanpa label atau error
    return (
      <input
        id={id}
        type="hidden"
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <div className={`form-group ${groupClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-600 mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {/* Input Box */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent ${inputClassName}`}
      />

      {/* Error Notice */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  inputClassName: PropTypes.string, // Prop untuk custom class input
  labelClassName: PropTypes.string, // Prop untuk custom class label
  groupClassName: PropTypes.string, // Prop untuk custom class div group
};

export default InputField;
