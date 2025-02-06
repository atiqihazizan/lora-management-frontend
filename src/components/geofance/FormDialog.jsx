import PropTypes from "prop-types";
import Dialog from "../Dialog";
import InputField from "../forms/InputField";

const FormDialog = ({
  open,
  title,
  onClose,
  onSave,
  formData,
  setFormData,
  errors,
}) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog
      isOpen={open}
      title={title}
      onClose={onClose}
      onOk={onSave}>
      <div className="flex flex-col gap-2">
        <InputField
          id="name"
          label="Name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name} // Menampilkan pesan error
          required
        />
        <InputField
          id="latlng"
          label="Center"
          placeholder="Enter center (e.g., 12.3456,78.9012)"
          value={formData.latlng}
          onChange={handleChange}
          error={errors.latlng} // Menampilkan pesan error
          required
        />
        <InputField
          id="zoom"
          label="Zoom"
          placeholder="Enter zoom level"
          value={formData.zoom}
          onChange={handleChange}
          error={errors.zoom} // Menampilkan pesan error
          required
        />
      </div>
    </Dialog>
  );
};

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string,
    latlng: PropTypes.string,
    zoom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    latlng: PropTypes.string,
    zoom: PropTypes.string,
  }),
};

export default FormDialog;