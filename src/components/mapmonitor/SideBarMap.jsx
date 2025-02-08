import { useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { isObjectNotEmpty } from "../../utils/components";
import { useMapGuestContext, useStateContext } from "../../utils/useContexts";
import logo from "../../assets/mesh-network.png";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

const SideBarMap = ({ setIsSidebarVisible, isSidebarVisible, mapRef, onBoundarySelect }) => {
  const navigate = useNavigate();
  const { userInfo } = useStateContext();
  const { mapSelect = null, guestMaps = [] } = useMapGuestContext();

  // Parse latlng string to array
  const parseLatlng = (latlng) => {
    if (Array.isArray(latlng)) return latlng;
    if (typeof latlng === 'string') {
      const coords = latlng.split(',').map(Number);
      if (coords.length === 2 && !coords.some(isNaN)) {
        return coords;
      }
    }
    return null;
  };

  // Memoize valid boundaries
  const validBoundaries = useMemo(() => {
    return (guestMaps || []).filter(b => {
      if (!isObjectNotEmpty(b)) return false;
      if (typeof b.id !== 'number') return false;
      if (typeof b.slug !== 'string') return false;
      if (typeof b.name !== 'string') return false;
      
      const coords = parseLatlng(b.latlng);
      return coords !== null;
    });
  }, [guestMaps]);

  // Handle boundary click
  const handleBoundaryClick = useCallback((boundary) => {
    try {
      // Only navigate to boundary URL, let MapMonitor handle the flying
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

  return (
    <>
      {/* Toggle Button - Always rendered but visibility controlled by transform */}
      <button 
        onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
        className={`z-[500] fixed top-5 left-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300 transform ${
          isSidebarVisible ? 'translate-x-64 opacity-0' : 'translate-x-0 opacity-100'
        }`}
        aria-label={isSidebarVisible ? "Close Sidebar" : "Open Sidebar"}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-[400] flex flex-col`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button 
            onClick={() => setIsSidebarVisible(false)} 
            className="absolute top-4 right-4 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
            aria-label="Close Sidebar"
          >
            <FaTimes size={20} />
          </button>

          {/* Logo and Title */}
          <img 
            src={logo} 
            alt="LoRa Mesh Network Logo" 
            className="w-16 h-16 mb-4 mx-auto"
          />
          <h1 className="text-lg font-bold mb-6 text-center">LoRa Mesh Network</h1>
        </div>

        {/* Boundaries List */}
        <div className="flex-1 px-4 overflow-hidden">
          <ul className="space-y-2 overflow-y-auto h-full pr-2">
            {validBoundaries.map((boundary) => (
              <li
                key={boundary.id}
                className={`px-4 py-2 ${
                  isObjectNotEmpty(mapSelect) && mapSelect?.id === boundary?.id
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                } rounded-lg cursor-pointer text-[10pt] transition-colors whitespace-nowrap overflow-hidden text-ellipsis`}
                onClick={() => handleBoundaryClick(boundary)}
                title={boundary.name}
              >
                {boundary.name}
              </li>
            ))}
            {validBoundaries.length === 0 && (
              <li className="px-4 py-2 text-gray-400 text-center text-[10pt]">
                No boundaries available
              </li>
            )}
          </ul>
        </div>

        {/* Admin/Login Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleAdminClick}
            className="w-full px-4 py-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {userInfo ? "Builder" : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};

SideBarMap.propTypes = {
  setIsSidebarVisible: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
  mapRef: PropTypes.shape({
    current: PropTypes.object
  }),
  onBoundarySelect: PropTypes.func
};

export default SideBarMap;
