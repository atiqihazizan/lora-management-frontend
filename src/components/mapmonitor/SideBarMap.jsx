import { useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { isObjectNotEmpty } from "../../utils/components";
import { useMapLayerContext, useStateContext } from "../../utils/useContexts";
import logo from "../../assets/mesh-network.png";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

const SideBarMap = ({ setIsSidebarVisible, isSidebarVisible }) => {
  const navigate = useNavigate();
  const { userInfo } = useStateContext();
  const { mapSelect = null, boundaries = [] } = useMapLayerContext();

  // Memoize valid boundaries
  const validBoundaries = useMemo(() => {
    return (boundaries || []).filter(b => 
      b && b.id && typeof b.slug === 'string' && b.name
    );
  }, [boundaries]);

  // Handle boundary click
  const handleBoundaryClick = useCallback((boundary) => {
    try {
      if (!boundary?.slug) {
        console.error('Invalid boundary slug:', boundary);
        return;
      }
      navigate(`/map/${boundary.slug}`);
      setIsSidebarVisible(false); // Auto close sidebar after selection
    } catch (error) {
      console.error('Error navigating to boundary:', error);
    }
  }, [navigate, setIsSidebarVisible]);

  // Handle admin/login click
  const handleAdminClick = useCallback(() => {
    try {
      navigate(userInfo ? "/" : "/login");
      setIsSidebarVisible(false); // Auto close sidebar
    } catch (error) {
      console.error('Error navigating to admin/login:', error);
    }
  }, [navigate, userInfo, setIsSidebarVisible]);

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback((isVisible) => {
    try {
      setIsSidebarVisible(isVisible);
    } catch (error) {
      console.error('Error toggling sidebar:', error);
    }
  }, [setIsSidebarVisible]);

  return (
    <div className="relative">
      {/* Toggle Button */}
      {!isSidebarVisible && (
        <button 
          onClick={() => handleSidebarToggle(true)} 
          className="z-[500] fixed top-5 left-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Open Sidebar"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Sidebar Content */}
      <div
        className={`${
          isSidebarVisible ? "translate-x-64" : "translate-x-0"
        } side-navbar transition-transform duration-300 ease-in-out`}
        onMouseLeave={() => handleSidebarToggle(false)}
      >
        {/* Close Button */}
        <button 
          onClick={() => handleSidebarToggle(false)} 
          className="absolute top-4 left-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close Sidebar"
        >
          <FaTimes size={20} />
        </button>

        {/* Logo and Title */}
        <img 
          src={logo} 
          alt="LoRa Mesh Network Logo" 
          className="w-20 h-20 mb-4 mx-auto"
        />
        <h1 className="text-xl font-bold mb-8 text-center">LoRa Mesh Network</h1>

        {/* Boundaries List */}
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] flex-grow">
          {validBoundaries.map((boundary) => (
            <li
              key={boundary.id}
              className={`p-3 ${
                isObjectNotEmpty(mapSelect) && mapSelect?.id === boundary?.id
                  ? "bg-gray-600"
                  : ""
              } rounded-lg hover:bg-gray-600 cursor-pointer text-[10pt] transition-colors`}
              onClick={() => handleBoundaryClick(boundary)}
            >
              {boundary.name}
            </li>
          ))}
          {validBoundaries.length === 0 && (
            <li className="p-3 text-gray-400 text-center text-[10pt]">
              No boundaries available
            </li>
          )}
        </ul>

        {/* Admin/Login Button */}
        <button
          onClick={handleAdminClick}
          className="px-6 py-2 mt-4 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg w-full transition-colors"
        >
          {userInfo ? "Admin" : "Login"}
        </button>
      </div>
    </div>
  );
};

SideBarMap.propTypes = {
  setIsSidebarVisible: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
};

export default SideBarMap;
