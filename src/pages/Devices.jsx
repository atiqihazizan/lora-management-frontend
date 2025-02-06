import { useState, useEffect } from "react";
import TableUI from "../components/elements/TableUI";
import apiClient from "../utils/apiClient";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import DialogDevice from "../components/DialogDevice";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await apiClient.get("/devices");
      setDevices(data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    }
  };

  const openDialog = (data = null) => {
    try {
      const parsedProp = data?.prop ? JSON.parse(data.prop || '[]') : [];
      const getData = { 
        ...data, 
        prop: parsedProp.map(p => ({
          ...p,
          val: (p.val ?? '').toString() // Convert val to string, handle null/undefined
        }))
      };
      setDialogData(getData || { name: "", type: "", status: "", prop: [] });
      setIsEditMode(!!data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error preparing device data:", error);
      setDialogData({ name: "", type: "", status: "", prop: [] });
      setIsEditMode(false);
      setDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };

  const handleSave = async (pendingData) => {
    try {
      if (isEditMode) {
        await apiClient.put(`/devices/${dialogData?.id}`, pendingData);
      } else {
        await apiClient.post("/devices", pendingData);
      }
      fetchDevices();
      closeDialog();
    } catch (error) {
      console.error("Failed to save device:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        await apiClient.delete(`/devices/${id}`);
        fetchDevices();
      } catch (error) {
        console.error("Failed to delete device:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Device Name" },
    // { key: "type", label: "Type" },
    // { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <TableUI
        title="Devices"
        data={devices}
        columns={columns}
        customButtons={[
          {
            label: "Add Device",
            onClick: () => openDialog(),
            className: "bg-blue-500 hover:bg-blue-600",
          },
        ]}
        actionColumn={{
          label: "Actions",
          layout: "horizontal",
          className: 'w-[100px] text-center',
          actions: [
            {
              icon: <FaPencilAlt />,
              tooltip: "Edit",
              onClick: (row) => openDialog(row),
              className: "btn-icon-secondary edit-button",
            },
            {
              icon: <FaTrash />,
              tooltip: "Delete",
              onClick: (row) => handleDelete(row?.id),
              className: "btn-icon-danger delete-button",
            },
          ],
        }}
      />

      {dialogOpen && (
        <DialogDevice
          fieldName={["name"]}
          isOpen={dialogOpen}
          onClose={closeDialog}
          onSave={handleSave}
          initialData={dialogData}
        />
      )}

    </div>
  );
};

export default Devices;
