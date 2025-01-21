import PropTypes from 'prop-types';

const InputCustom = ({ children }) => {
  return (
    <div className="form-group">
      <label className="label-form">
        Properties
      </label>
      {children}
    </div>
  );
};

InputCustom.propTypes = {
  children: PropTypes.node
};

export default InputCustom;

