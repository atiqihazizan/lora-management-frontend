import {  useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { isObjectNotEmpty } from "../../utils/constants";
import { useMapLayerContext, useStateContext } from "../../utils/useContexts";
import logo from "../../assets/mesh-network.png";
import PropTypes from "prop-types";

const SideBarMap = ({ setIsSidebarVisible, isSidebarVisible }) => {
  const navigate = useNavigate();
  const { userInfo } = useStateContext();
  const { mapSelect = null, boundaries = [] } = useMapLayerContext();

  return (
    <div className="relative">
      {!isSidebarVisible && (
        <button onClick={() => setIsSidebarVisible(true)} className="z-[500] fixed top-5 left-4 p-2 bg-gray-800 text-white rounded-full">
          <FaBars size={20} />
        </button>
      )}
      <div
        className={`${isSidebarVisible ? "translate-x-64" : "translate-x-0"} side-navbar`}
        onMouseLeave={() => setIsSidebarVisible(false)}
      >
        <button onClick={() => setIsSidebarVisible(false)} className="absolute top-4 left-4 p-2 bg-gray-800 text-white rounded-full">
          <FaTimes size={20} />
        </button>
        <img src={logo} alt="Logo" className="w-20 h-20 mb-4 mx-auto" />
        <h1 className="text-xl font-bold mb-8 text-center">LoRa Mesh Network</h1>
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] flex-grow">
          {boundaries?.map((boundary, index) => (
            <li
              key={index}
              className={`p-3 ${(isObjectNotEmpty(mapSelect) && mapSelect?.id === boundary?.id) ? 'bg-gray-600' : ''} rounded-lg hover:bg-gray-600 cursor-pointer text-[10pt]`}
              onClick={() => navigate(`/map/${boundary.slug}`)}
            >
              {boundary.name}
            </li>
          ))}
        </ul>
        <button onClick={() => userInfo ? navigate("/") :navigate("/login")} className="px-6 py-2 mt-4 text-white text-sm bg-blue-600 rounded-lg w-full">
          {userInfo ? 'Admin' : 'Login'}
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
