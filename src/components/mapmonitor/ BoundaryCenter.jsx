import { FaLocationCrosshairs } from "react-icons/fa6";
import { useMapContext } from "../../utils/useContexts";

function BoundaryCenter({ mapRef, zoom, center }) {
  const { flyToOptions } = useMapContext();

  // Function to handle center button click
  const handleCenterClick = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom || 15, flyToOptions);
    }
  };
  return (
    <button
      onClick={handleCenterClick}
      className="absolute z-[1000] top-36 right-3 bg-white p-2 rounded-md shadow-md border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
      title="Center Map"
    >
    <FaLocationCrosshairs className="w-4 h-4" />
  </button>
  );
};

export default BoundaryCenter;