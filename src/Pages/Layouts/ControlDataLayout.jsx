import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DataControlNav from "../../Components/DataControlNav";

const ControlDataLayout = () => {
  return (
    <div>
      <DataControlNav />
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default ControlDataLayout;
