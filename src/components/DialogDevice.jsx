import { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaTrash,
  FaTimes,
  FaPlusCircle,
  FaMinusCircle
} from "react-icons/fa";
import { ICONS } from "../utils/icons";
import PropTypes from "prop-types";
import Dialog from "./Dialog";
import InputField from "./forms/InputField";
import Button from "./elements/Button";
import SelectField from "./forms/SelectField";
import { units } from "../utils/constants";
import { formatLatLong, formatLatLonToArray } from "../utils/components";

// Format units untuk SelectField
const formattedUnits = units.map(unit => ({
  value: unit.symbol,
  label: `${unit.label} (${unit.symbol})`
}));

const DEFAULT_FEATURE = {
  label: "",
  key: "",
  val: "",
  unit: formattedUnits[0]?.value || "" // Default to first unit
};

const DialogDevice = ({ 
  fieldName = ["name", "topic"], 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData 
}) => {
  const [deviceData, setDeviceData] = useState({
    name: "",
    topic: "",
    prop: [],
    latlng: "",
    icon: Object.keys(ICONS)[0] || "" // Default to first icon
  });
  const [error, setError] = useState(null);
  const [icons] = useState(() => 
    Object.keys(ICONS)
      .filter(i => typeof (ICONS[i]) !== 'function' && i)
      .map(String)
  );

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      try {
        // Format latlng to proper format
        const formattedData = {
          ...initialData,
          icon: initialData.icon || Object.keys(ICONS)[0] || "", // Default icon
          latlng: formatLatLong(initialData.latlng || ""),
          prop: Array.isArray(initialData.prop) ? initialData.prop.map(p => ({
            ...p,
            unit: p.unit || formattedUnits[0]?.value || "" // Default unit
          })) : []
        };
        setDeviceData(formattedData);
      } catch (error) {
        console.error('Error formatting device data:', error);
        setDeviceData({
          name: initialData.name || "",
          topic: initialData.topic || "",
          prop: [],
          latlng: "",
          icon: Object.keys(ICONS)[0] || ""
        });
        setError('Error loading location data');
      }
    } else {
      setDeviceData({
        name: "",
        topic: "",
        prop: [],
        latlng: "",
        icon: Object.keys(ICONS)[0] || ""
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (field) => (e) => {
    setError(null); // Clear error when user makes changes
    const value = e.target.value;
    setDeviceData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    setDeviceData(prev => ({
      ...prev,
      prop: [...prev.prop, { ...DEFAULT_FEATURE }],
    }));
  };

  const handleChangeFeature = (index, field, value) => {
    setError(null); // Clear error when user makes changes
    setDeviceData(prev => {
      const updatedProp = [...prev.prop];
      updatedProp[index] = {
        ...updatedProp[index],
        // Ensure val is always string
        [field]: field === 'val' ? String(value) : value
      };
      return { ...prev, prop: updatedProp };
    });
  };

  const handleRemoveFeature = (index) => {
    setDeviceData(prev => ({
      ...prev,
      prop: prev.prop.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    // Validate required fields
    if (!deviceData.name?.trim()) {
      setError("Name is required");
      return false;
    }

    // Topic is optional, if present we'll save it

    // Validate features if any exist
    if (deviceData.prop?.length > 0) {
      const hasEmptyFeature = deviceData.prop.some(
        (feature) => !feature.label?.trim() || !feature.key?.trim() || feature.val === "" || !feature.unit?.trim()
      );
      if (hasEmptyFeature) {
        setError("Please fill in all fields for each feature");
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      // Format data for saving
      const formattedData = {
        ...deviceData,
        // Keep latlng as string for API, will be converted to array by MapContext
        latlng: deviceData.latlng ? formatLatLong(deviceData.latlng) : "",
        // Ensure prop is array and val is string
        prop: Array.isArray(deviceData.prop) 
          ? deviceData.prop.map(p => ({
              ...p,
              val: String(p.val || '')
            }))
          : []
      };

      onSave(formattedData);
    } catch (error) {
      console.error('Error saving device:', error);
      setError('Error saving device data. Please check the coordinates format.');
    }
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
      className: "hover:bg-red-600",
    },
    {
      label: "Cancel",
      onClick: onClose,
      variant: "secondary",
      className: "flex-1 hover:bg-gray-200",
    },
    {
      label: "Save",
      onClick: handleSave,
      variant: "primary",
      className: "flex-1 hover:bg-blue-600",
    },
  ].filter(Boolean);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={deviceData.id ? "Edit Marker" : "Add Marker"}
      footerButtons={footerButtons}
      width="1100px"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-row space-x-6">
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
              required={field === "name"}
              error={field === "name" && !deviceData?.[field]?.trim() ? `${field} is required` : ""}
            />
          ))}

          <SelectField
            id="device-icon"
            label="Icon"
            value={deviceData.icon || Object.keys(ICONS)[0] || ""}
            onChange={handleChange("icon")}
            options={icons.map(icon => ({ value: icon, label: icon }))}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Features</h3>
            <button
              onClick={handleAddFeature}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              <FaPlus /> Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {deviceData.prop?.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg relative">
                <div className="flex-1">
                  <InputField
                    label="Label"
                    value={feature.label}
                    onChange={(e) => handleChangeFeature(index, "label", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Key"
                    value={feature.key}
                    onChange={(e) => handleChangeFeature(index, "key", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Value"
                    value={feature.val}
                    onChange={(e) => handleChangeFeature(index, "val", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <SelectField
                    id={`feature-${index}-unit`}
                    label="Unit"
                    value={feature.unit || formattedUnits[0]?.value || ""}
                    onChange={(e) => handleChangeFeature(index, "unit", e.target.value)}
                    options={formattedUnits}
                    required
                  />
                </div>
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="mt-7 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  title="Remove feature"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {deviceData.prop?.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No features added yet. Click "Add Feature" to start adding features.
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

DialogDevice.propTypes = {
  fieldName: PropTypes.arrayOf(PropTypes.string),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    topic: PropTypes.string,
    latlng: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.number)
    ]),
    icon: PropTypes.string,
    prop: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        key: PropTypes.string,
        val: PropTypes.string,
        unit: PropTypes.string,
      })
    ),
  }),
};

export default DialogDevice;
