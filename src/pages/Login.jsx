import { useState } from "react";
import { useStateContext } from "../context/StateContext";
import loraMeshLogo from "../assets/mesh-network.png"; // Path ke logo LoRa Mesh
import backgroundImage from "../assets/forest-background.webp"; // Path to the background image

const LoginPage = () => {
  const { login } = useStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(null); // Reset error message

    if (username && password) {
      login(username, password); // Tunggu hasil login
    } else {
      setError("Please fill in both fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 relative">
      {/* Background animasi */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})`, opacity: 0.3 }}></div>

      {/* Form Login */}
      <div className="relative z-10 w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img
            src={loraMeshLogo}
            alt="LoRa Mesh Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-700">LoRa Mesh Management</h1>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
