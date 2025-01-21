import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { to: "/dashboard", icon: "fas fa-home", label: "Home" },
    // { to: "/map-builder", icon: "fas fa-map", label: "Map Builder" },
    // { to: "/settings/general", icon: "fas fa-cog", label: "General Settings" },
    // { to: "/settings/advanced", icon: "fas fa-tools", label: "Advanced Settings" },
    { to: "/settings/devices", icon: "fas fa-microchip", label: "Devices" }, // Item baru
    { to: "/settings/tiles", icon: "fas fa-th", label: "Tiles" },
    { to: "/settings/users", icon: "fas fa-users", label: "Users" },
  ];

  return (
    <div className="w-1/6 bg-gray-900 text-white p-4 flex flex-col h-screen">
      {/* Logo */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-wider">Setting</h1>
      </div>

      {/* Navigation */}
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index} className="group">
            <Link
              to={item.to}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <span className="w-6 h-6 flex justify-center items-center bg-gray-700 group-hover:bg-gray-600 rounded">
                <i className={item.icon}></i>
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {/* <div className="mt-auto text-center text-xs text-gray-400">
        © 2024 MyApp. All rights reserved.
      </div> */}
    </div>
  );
};

export default Sidebar;
