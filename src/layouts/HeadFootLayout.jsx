import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropTypes from 'prop-types';

const HeadFootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

HeadFootLayout.propTypes = {
  children: PropTypes.node,
};

export default HeadFootLayout;