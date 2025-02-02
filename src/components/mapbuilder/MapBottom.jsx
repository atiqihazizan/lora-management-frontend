import { MapContainer, TileLayer } from 'react-leaflet';
import { FaMinus, FaPlus, FaLocationCrosshairs } from 'react-icons/fa6';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useMapContext } from '../../utils/useContexts';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import apiClient from '../../utils/apiClient';

const MapBottom = ({
  id,
  mapview,
  tiles,
  handleZoomIn,
  handleZoomOut,
  handleCenterButtonClick,
}) => {
  const queryClient = useQueryClient();
  const { setTileLayer, setCurrentTileIndex, currentTileIndex, boundaryFlag, setBoundaryFlag } = useMapContext();

  const findDefaultTileIndex = () => {
    if (mapview?.tile_url !== null) {
      const index = tiles.findIndex((tile) => tile.url === mapview?.tile_url);
      return index !== -1 ? index : 0; // Jika ditemukan, gunakan index, jika tidak gunakan 0
    }
    return 0; // Default ke 0 jika tile_url null
  };

  useEffect(() => { setCurrentTileIndex(findDefaultTileIndex()) }, [mapview, tiles]);
  const saveTileLayerToDB = useMutation({
    mutationFn: async (data) => {
      const result = await apiClient.put(`/mapview/tilelayer/${id}`, { tile_url: data });
      return { result, data: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mapview']);
      // queryClient.removeQueries(['mapview']);
    },
  });

  const handleMinimapClick = () => {
    const nextIndex = (currentTileIndex + 1) % tiles.length; // Hitung indeks tile berikutnya
    const nextTileLayer = tiles[nextIndex].url; // URL tile berikutnya
    setCurrentTileIndex(nextIndex); // Perbarui currentTileIndex
    setTileLayer(nextTileLayer); // Set tile layer di main map
    saveTileLayerToDB.mutateAsync(nextTileLayer); // Simpan perubahan tile layer ke database
  };

  const nextTileIndex = (currentTileIndex + 1) % tiles.length; // Indeks tile untuk minimap

  return (
    <>
      {!boundaryFlag &&
        <>
          <div className="minimap-container" onClick={handleMinimapClick}>
            <MapContainer
              center={mapview.latlng}
              zoom={10}
              className="minimap"
              dragging={false}
              zoomControl={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              attributionControl={false}
            >
              <TileLayer url={tiles?.[nextTileIndex]?.url || tiles?.[0]?.url} />
            </MapContainer>
            <div className="minimap-label">
              {tiles?.[nextTileIndex]?.name || 'Default'}
            </div>
          </div>

          <div className="btn-zoom bottom-[10px] overflow-hidden">
            <button
              className="btn-zoom-content border-b border-gray-300"
              onClick={handleZoomIn}
            >
              <FaPlus className="h-3 w-3 text-gray-600" />
            </button>
            <button className="btn-zoom-content" onClick={handleZoomOut} >
              <FaMinus className="h-3 w-3 text-gray-600" />
            </button>
          </div>

          {/* Tombol untuk memusatkan lokasi */}
          <button className="btn-location-center" onClick={handleCenterButtonClick}>
            <FaLocationCrosshairs className="h-4 w-4 text-gray-600" />
          </button>
        </>
      }

      {/* <div
        className={`boundaries-container`}
        onClick={() => {
          const isFlag = !boundaryFlag;
          setBoundaryFlag(isFlag)
          setTileLayer(isFlag ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : tiles[currentTileIndex].url)
        }}
      >
        {boundaryFlag ? (
          <GiPositionMarker className="w-2/4 h-10 mx-4 mt-2 text-red-400" />
        ) : (
          <FaDrawPolygon className="w-2/4 h-10 mx-4 mt-2 text-blue-400 bg-gre" />
        )}
        <div className="minimap-label">{boundaryFlag ? 'Marker' : 'Boundary'}</div>
      </div> */}

    </>
  );
};

// Menentukan tipe properti dengan PropTypes
MapBottom.propTypes = {
  id: PropTypes.string.isRequired,
  mapview: PropTypes.shape({
    latlng: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]),).isRequired,
    tile_url: PropTypes.string
  }).isRequired,
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  // nextTileIndex: PropTypes.number.isRequired,
  // handleMinimapClick: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleCenterButtonClick: PropTypes.func.isRequired,
};

export default MapBottom;
