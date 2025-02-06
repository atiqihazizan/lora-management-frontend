import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import { ICONS } from "../../utils/icons";
import { Link } from "react-router";
import { FaCog, FaEllipsisV, FaTrash } from "react-icons/fa";

function MapToolbar({ siteName }) {

  return (
    <aside className="menu-sensor-container grid grid-cols-4 bg-gray-800">
      <div className="flex gap-2">
        <div className="card !pr-0">
          <Link
            to="/dashboard"
            key={123}
            className="btn-flex-icon-text btn-bg-white">
            {ICONS["home"]} Home
          </Link>
        </div>
      </div>

      <div className="col-span-2 text-center">
        <p className="text-white text-3xl pt-1 font-bold">{siteName}</p>
      </div>

      <div className="flex justify-end pt-1">
      <Menu as="div" className="relative">
        <Menu.Button className="btn-flex-icon-text mt-1 text-white">
          <FaEllipsisV size={24} />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`${
                  active ? "bg-gray-200" : ""
                } flex items-center gap-2 w-full px-4 py-2 text-left`}
                >
                <FaCog /> Setting 
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-red-500 text-white" : ""
                } flex items-center gap-2 w-full px-4 py-2 text-left`}
                onClick={() => alert("Padam data")}>
                <FaTrash /> Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      </div>
    </aside>
  );
}

MapToolbar.propTypes = {
  // tiles: PropTypes.arrayOf(PropTypes.object),
  siteName: PropTypes.string,
};

export default MapToolbar;
