import { useState, useEffect } from "react";
import Dialog from "../components/Dialog";
import TableUI from "../components/elements/TableUI";
import InputField from "../components/forms/InputField";
import apiClient from "../utils/apiClient";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const Tiles = () => {
  const [tiles, setTiles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      const data = await apiClient.get("/tiles");
      setTiles(data);
    } catch (error) {
      console.error("Failed to fetch tiles:", error);
    }
  };

  const openDialog = (data = null) => {
    setDialogData(data || { name: "", url: "", icon: "", theme: "" });
    setIsEditMode(!!data);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        await apiClient.put(`/tiles/${dialogData.id}`, dialogData);
      } else {
        await apiClient.post("/tiles", dialogData);
      }
      fetchTiles();
      closeDialog();
    } catch (error) {
      console.error("Failed to save tile:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tile?")) {
      try {
        await apiClient.delete(`/tiles/${id}`);
        fetchTiles();
      } catch (error) {
        console.error("Failed to delete tile:", error);
      }
    }
  };

  const shortenUrl = (url) => {
    const maxLength = 30;
    return url && url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "url", label: "URL", render: (value) => shortenUrl(value) },
    { key: "icon", label: "Icon" },
    { key: "theme", label: "Theme" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <TableUI
        title="Tiles"
        data={tiles}
        columns={columns}
        customButtons={[
          {
            label: "Add Tile",
            onClick: () => openDialog(),
            className: "bg-blue-500 hover:bg-blue-600",
          },
        ]}
        actionColumn={{
          label: "Actions",
          layout: "horizontal",
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
              onClick: (row) => handleDelete(row.id),
              className: "btn-icon-danger delete-button",
            },
          ],
        }}
      />

      <Dialog
        isOpen={dialogOpen}
        title={isEditMode ? "Edit Tile" : "Add Tile"}
        onClose={closeDialog}
        onOk={handleSave}
      >
        <div className="space-y-4">
          <InputField
            id="tile-name"
            label="Name"
            value={dialogData?.name || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <InputField
            id="tile-url"
            label="URL"
            value={dialogData?.url || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, url: e.target.value }))}
            required
          />
          <InputField
            id="tile-icon"
            label="Icon"
            value={dialogData?.icon || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, icon: e.target.value }))}
            required
          />
          <InputField
            id="tile-theme"
            label="Theme"
            value={dialogData?.theme || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, theme: e.target.value }))}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Tiles;
