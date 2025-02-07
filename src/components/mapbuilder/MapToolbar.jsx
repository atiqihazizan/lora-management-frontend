import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { FaCog, FaBars, FaTrash, FaUpload, FaHome } from "react-icons/fa";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownFileUpload } from "../Dropdown";
import apiClient from "../../utils/apiClient";
import { useMapContext } from "../../utils/useContexts";

function MapToolbar({ siteName, mapData }) {
  const { setGeoJsonData } = useMapContext();
  const handleFileUpload = async (file) => {
    try {
      // Check file size (10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      const data = await apiClient.upload('/upload/json', file, {mapId: mapData.id}, (progress) => {
        console.log(`Upload Progress: ${progress}%`);
      });

      console.log('File uploaded successfully:', data);
      // window.location.reload(); // Refresh to show new map data
      if(data?.geojsonData)setGeoJsonData(data.geojsonData);

    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert(error.message || 'Error uploading file. Please try again.');
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
  mapData: PropTypes.object,
};

export default MapToolbar;
