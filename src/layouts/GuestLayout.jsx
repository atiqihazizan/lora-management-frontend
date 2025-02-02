import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../utils/useContexts";
import PropTypes from 'prop-types';

const GuestLayout = () => {
  const { userToken } = useStateContext()

  if (userToken) return <Navigate to="/" />;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

GuestLayout.propTypes = {
  children: PropTypes.node,
};

export default GuestLayout;
