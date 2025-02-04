import PropTypes from "prop-types";
import Dialog from "../Dialog";
import InputField from "../forms/InputField";
import { useState } from "react";

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

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, path: event.target.files[0] })); // Simpan fail dalam formData
    }
  };
  
  const handleClearFile = () => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData.path; // Hapuskan 'path' dari objek
      return newFormData;
    });
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
        <InputField
          id="geojsonFile"
          label="Upload GeoJSON File"
          type="file"
          onChange={handleFileChange}
          value={formData.path} // Papar nama fail jika ada
          accept=".json"
          onClear={handleClearFile}
          error={errors.path}
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
    path: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // Pastikan path boleh simpan fail atau string
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    latlng: PropTypes.string,
    zoom: PropTypes.string,
    path: PropTypes.string,
  }),
};

export default FormDialog;