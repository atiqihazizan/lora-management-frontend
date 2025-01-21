import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loraMeshLogo from "../assets/mesh-network.png"; // Path ke logo LoRa Mesh
import backgroundImage from "../assets/forest-background.webp"; // Path ke background image
import apiClient from "../utils/apiClient";
import Button from "../components/elements/Button";
import InputField from "../components/forms/InputField";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await apiClient.post("/auth/register", { username, password });
      console.log(response)
      setSuccess("User registered successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 relative">
      {/* Background animasi */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})`, opacity: 0.3 }}
      ></div>

      {/* Form Register */}
      <div className="relative z-10 w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img
            src={loraMeshLogo}
            alt="LoRa Mesh Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-700">Register</h1>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister}>
          <InputField
            id="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputField
            id="confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="mt-6">
            <Button
              type="submit"
              label="Register"
              variant="primary"
              size="md"
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
