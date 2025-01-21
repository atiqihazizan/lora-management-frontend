import PropTypes from "prop-types";

const InputReadOnly = ({ label, value }) => {
  return <div className="form-group">
    <label className="label-form">
      {label}
    </label>
    <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
      {value}
    </p>
  </div>
}

InputReadOnly.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default InputReadOnly;
