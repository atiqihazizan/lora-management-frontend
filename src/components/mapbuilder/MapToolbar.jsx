import PropTypes from 'prop-types';
import DragTools from './DragTools.jsx';
import { useMemo } from 'react';
import { ICONS } from '../../utils/icons';
import { Link } from 'react-router';
import { useMapContext } from '../../utils/useContexts.js';

function MapToolbar({ devices,siteName }) {
  const { boundaryFlag } = useMapContext();
  const tools = useMemo(
    () => [
      {
        title: 'Features',
        content: devices
          ?.map((device, idx) => (
            <DragTools key={idx} data={device} type="point">
              {ICONS[device.icon]} {device.name}
            </DragTools>
          ))
      },
    ],
    [devices]
  );

  return (
    <aside className="menu-sensor-container flex justify-between bg-gray-800">
      <div className="flex gap-2">
        <div className="card !pr-0">
          <Link to="/dashboard" key={123} className="btn-flex-icon-text btn-bg-white">
            {ICONS['home']} Home
          </Link>
        </div>
        {!boundaryFlag && tools.map(({ content }, idx) => (
          <div className="card" key={idx}>
            <div className="flex gap-2 text-lg">{content}</div>
          </div>
        ))}
      </div>
      <p  className='text-white text-3xl pt-1 font-bold'>{siteName}</p>
      <div></div>
    </aside>
  );
}

MapToolbar.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.object),
  // tiles: PropTypes.arrayOf(PropTypes.object),
  siteName: PropTypes.string
};

export default MapToolbar;
