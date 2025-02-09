import PropTypes from 'prop-types';

const SelectField = ({
  id,
  label,
  labelOptions = "",
  options = [],
  value,
  onChange = () => { },
  error,
  required = false,
  selectClassName = "",
  labelClassName = "",
  groupClassName = "",
  disabled = false,
}) => {
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

      {/* Select Box */}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border ${error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${selectClassName}`}
      >
        <option value="" disabled>{`Select ${labelOptions}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Error Notice */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelOptions: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  selectClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  groupClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SelectField;
