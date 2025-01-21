import PropTypes from "prop-types";
import Dialog from "../Dialog";
// import TextareaField from "./forms/TextareaField";
import InputField from "../forms/InputField";

const FormDialog = ({
  isDialogOpen,
  editMode,
  closeDialog,
  handleSave,
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
      isOpen={isDialogOpen}
      title={editMode ? "Edit Configuration" : "Add New Configuration"}
      onClose={closeDialog}
      onOk={handleSave}
    >
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
        {/* <TextareaField
          id="bounding"
          label="Coordinate Area"
          placeholder="Enter coordinates (optional)"
          value={formData.bounding || ""}
          onChange={handleChange}
          error={errors.bounding} // Menampilkan pesan error
        /> */}
      </div>
    </Dialog>
  );
};

FormDialog.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    latlng: PropTypes.string.isRequired,
    zoom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    bounding: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    latlng: PropTypes.string,
    zoom: PropTypes.string,
    bounding: PropTypes.string,
  }).isRequired,
};

export default FormDialog;
