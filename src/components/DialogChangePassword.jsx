import { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "./Dialog";
import InputField from "./forms/InputField";
import apiClient from "../utils/apiClient";

const DialogChangePassword = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return true;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return true;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await apiClient.post("/auth/change-password", { oldPassword, newPassword });

      setSuccessMessage("Password updated successfully.");
      setTimeout(() => {
        onClose(); // Tutup dialog setelah beberapa saat
      }, 2000);
      return false;
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message || "An error occurred. Please try again.");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Change Password"
      onClose={onClose}
      onOk={handleSave}
      width="400px"
    >
      <div className="space-y-4">
        <InputField
          id="old-password"
          label="Old Password"
          type="password"
          placeholder="Enter your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <InputField
          id="new-password"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <InputField
          id="confirm-password"
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
      </div>
      {isLoading && <p className="text-sm text-gray-500">Updating password...</p>}
    </Dialog>
  );
};

DialogChangePassword.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Prop untuk mengawal dialog terbuka atau tidak
  onClose: PropTypes.func.isRequired, // Callback untuk menutup dialog
};

export default DialogChangePassword;
