import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaCogs, FaKey, FaMap } from "react-icons/fa";
import { useStateContext } from "../utils/useContexts";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userInfo, logout, setIsChangePasswordOpen } = useStateContext();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const username = userInfo?.username || "Guest";
  const email = userInfo?.email || "example@example.com";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="p-2 bg-gray-800 text-white shadow-md">
      <div className="px-3 mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold hover:text-gray-300 transition duration-300">
            <Link to="/">LoRaMesh Managed Services</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md"
            onClick={() => navigate("/map")}
          >
            <FaMap className="text-gray-400" />
            <span>Live</span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center focus:outline-none p-2 rounded-lg"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${username}&background=E3FCEC&color=087F23&bold=true`}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${username}&background=E3FCEC&color=087F23&bold=true`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{username}</p>
                    <p className="text-xs text-gray-600">{email}</p>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUser className="text-gray-500" />
                    <span>Public Profile</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <FaCogs className="text-gray-500" />
                    <span>Settings</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsChangePasswordOpen(true);
                    }}
                  >
                    <FaKey className="text-gray-500" />
                    <span>Change Password</span>
                  </button>
                </div>
                <div className="px-4 py-3 border-t">
                  <button
                    className="w-full text-center text-sm font-bold text-gray-700 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition duration-300"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
