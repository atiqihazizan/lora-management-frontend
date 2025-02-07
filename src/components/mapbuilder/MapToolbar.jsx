import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { FaCog, FaBars, FaTrash, FaUpload, FaHome, FaFile, FaMap } from "react-icons/fa";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownFileUpload } from "../Dropdown";

function MapToolbar({ siteName }) {
  const handleFileUpload = async (file) => {
    try {
      const response = await apiClient.post('/api/upload', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.data;
      console.log('File uploaded successfully:', data);
      // Handle success (e.g., show notification, update UI)
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="  bg-gray-800 text-white">
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white hover:text-gray-400"
          >
            <FaHome className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ">{siteName}</h1>
        </div>

        <Dropdown>


          <DropdownButton
            icon={FaBars}
            label=""
            background="text-white hover:bg-gray-200/50"
            className="!p-2"
          />
          <DropdownMenu>
            <DropdownFileUpload
              icon={FaUpload}
              label="Upload Map File"
              onFileSelect={handleFileUpload}
              accept=".kml,.kmz,.geojson,.json"
              multiple={false}
            />
            <DropdownItem
              icon={FaCog}
              label="Settings"
              href="/settings"
              type="link"
            />
            <DropdownItem
              icon={FaTrash}
              label="Delete"
              onClick={() => { }}
              disabled={true}
            />
          </DropdownMenu>
        </Dropdown>

      </div>
    </div>
  );
}

MapToolbar.propTypes = {
  siteName: PropTypes.string,
};

export default MapToolbar;
