import { useState, useEffect } from "react";
import Dialog from "../components/Dialog";
import TableUI from "../components/elements/TableUI";
import InputField from "../components/forms/InputField";
import apiClient from "../utils/apiClient";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiClient.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const openDialog = (data = null) => {
    setDialogData(data || { username: "", email: "", phone_number: "" });
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
        await apiClient.put(`/users/${dialogData.id}`, dialogData);
      } else {
        await apiClient.post("/users", dialogData);
      }
      fetchUsers();
      closeDialog();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiClient.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <TableUI
        title="Users"
        data={users}
        columns={columns}
        customButtons={[
          {
            label: "Add User",
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
              className: "btn-icon-secondary",
            },
            {
              icon: <FaTrash />,
              tooltip: "Delete",
              onClick: (row) => handleDelete(row.id),
              className: "btn-icon-danger",
            },
          ],
        }}
      />

      <Dialog
        isOpen={dialogOpen}
        title={isEditMode ? "Edit User" : "Add User"}
        onClose={closeDialog}
        onOk={handleSave}
      >
        <div className="space-y-4">
          <InputField
            id="user-username"
            label="Username"
            value={dialogData?.username || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
          <InputField
            id="user-email"
            label="Email"
            value={dialogData?.email || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <InputField
            id="user-phone_number"
            label="Phone Number"
            value={dialogData?.phone_number || ""}
            onChange={(e) => setDialogData((prev) => ({ ...prev, phone_number: e.target.value }))}
            required
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Users;
