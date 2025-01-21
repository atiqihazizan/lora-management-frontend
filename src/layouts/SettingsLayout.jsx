import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

import PropTypes from 'prop-types';

const SettingsLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-4 bg-gray-100">
        {children}
        <Outlet />
      </main>
    </div>
  )
};

SettingsLayout.propTypes = {
  children: PropTypes.node,
};

export default SettingsLayout;