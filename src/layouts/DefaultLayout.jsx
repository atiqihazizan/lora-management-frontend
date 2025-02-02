import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../utils/useContexts";
import PropTypes from 'prop-types';

const DefaultLayout = () => {
  const { userToken } = useStateContext()
  if (!userToken) return <Navigate to="login" />
  return (<Outlet />);
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;