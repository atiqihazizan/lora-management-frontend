import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa"
import { ICONS } from "../utils/icons";
import PropTypes from "prop-types";
import Dialog from "./Dialog";
import InputField from "./forms/InputField";
import Button from "./elements/Button";
import SelectField from "./forms/SelectField";
import { units } from "../utils/constants"; // Import units

const DialogDevice = ({ fieldName = ["name", "topic"], isOpen, onClose, onSave, onDelete, initialData }) => {
  const [deviceData, setDeviceData] = useState(initialData);
  const [error, setError] = useState(null);
  const [icons] = useState(() => Object.keys(ICONS).filter(i => typeof (ICONS[i]) !== 'function' && i).map(String));

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setDeviceData({ ...deviceData, [field]: value });
  };

  const handleAddFeature = () => {
    setDeviceData({
      ...deviceData,
      prop: [...deviceData.prop, { label: "", key: "", val: "", unit: "" }],
    });
  };

  const handleChangeFeature = (index, field, value) => {
    const updatedProp = [...deviceData.prop];
    updatedProp[index][field] = value;
    setDeviceData({ ...deviceData, prop: updatedProp });
  };

  const handleRemoveFeature = (index) => {
    const updatedProp = deviceData.prop.filter((_, i) => i !== index);
    setDeviceData({ ...deviceData, prop: updatedProp });
  };

  const handleSave = () => {
    if (!deviceData.name) return setError("Please fill in all required fields.");

    const hasEmptyFeature = deviceData.prop.some(
      (feature) => !feature.label || !feature.key || feature.val === "" || !feature.unit
    );
    if (hasEmptyFeature) return setError("Please fill in all fields for each feature.");

    onSave(deviceData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      onDelete(deviceData);
    }
  };

  const footerButtons = [
    deviceData.id && onDelete && {
      label: "Delete",
      onClick: handleDelete,
      variant: "danger",
    },
    {
      label: "Cancel",
      onClick: onClose,
      variant: "secondary",
      className: "flex-1",
    },
    {
      label: "Save",
      onClick: handleSave,
      variant: "primary",
      className: "flex-1",
    },
  ].filter(Boolean);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Marker" : "Add Marker"}
      footerButtons={footerButtons}
      width="1100px"
    >

      {error && <p className="text-red-500 text-sm my-5">{error}</p>}

      <div className="flex flex-row space-x-4">
        <div className="space-y-4 w-[400px]">
          <InputField
            id="marker-latlng"
            type="hidden"
            value={deviceData.latlng || ""}
          />

          {fieldName.map((field, index) => (
            <InputField
              key={index}
              id={`marker-${field}`}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={deviceData?.[field] || ""}
              onChange={handleChange(field)}
              placeholder={`Enter ${field}`}
              required={field === "name" || field === "topic"}
            />
          ))}

          <SelectField
            id={`icon`}
            label="Icon"
            value={deviceData.icon || ""}
            options={icons.map((icon) => ({ value: icon, label: icon }))}
            onChange={handleChange("icon")}
            selectClassName="w-full border border-gray-300 rounded-md px-2 text-sm leading-4"
            groupClassName="!mb-0" />
        </div>
        <div className="pt-[.9rem]">
          <h3 className="text-lg font-bold mb-[.3rem] hidden">Features</h3>

          <div className="overflow-auto max-h-[300px] rounded-md">
            <table className="table-auto w-full border-collapse">
              <thead className="sticky top-0">
                <tr>
                  {["Label", "Key", "Value", "Unit"].map((header, index) => (
                    <th
                      key={index}
                      className="border-b border-gray-300 pl-5 pb-2 text-left w-[200px]"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="border-b border-gray-300 pl-4 pb-2 text-left">
                    <Button
                      icon={<FaPlus className="w-2 h-2" />}
                      onClick={handleAddFeature}
                      variant="primary"
                      size="md"
                    // className="mt-4"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {deviceData?.prop?.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {["label", "key", "val"].map((field) => (
                      <td key={field} className="pl-2 py-1">
                        <InputField
                          id={`feature-${field}-${index}`}
                          value={feature?.[field]}
                          onChange={(e) => handleChangeFeature(index, field, e.target.value)}
                          placeholder={`Enter ${field}`}
                          inputClassName="w-full border border-gray-300 rounded-md px-2 text-sm leading-4"
                          groupClassName="!mb-0"
                        />
                      </td>
                    ))}

                    <td className="pl-2 py-1 w-[150px] align-top">
                      <SelectField
                        id={`feature-unit-${index}`}
                        value={feature.unit || ""}
                        options={units.map((unit) => ({ value: unit.symbol, label: `${unit.label} (${unit.symbol})` }))}
                        onChange={(e) => handleChangeFeature(index, "unit", e.target.value)}
                        selectClassName="w-full border border-gray-300 rounded-md px-2 text-sm leading-4"
                        groupClassName="!mb-0"
                      />
                    </td>

                    <td className="pl-4 py-1 text-center">
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove feature"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

DialogDevice.propTypes = {
  fieldName: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    topic: PropTypes.string,
    icon: PropTypes.string,
    latlng: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // updated to accept both string and array
    prop: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]), // updated to accept string, array, or object
  }),
};

export default DialogDevice;
