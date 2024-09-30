import { Outlet } from "react-router-dom";
import Nav from "../../Components/Nav";
import Footer from "../../Components/Footer";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <ToastContainer className={"text-center"} />
      <Footer />
    </div>
  );
};

export default MainLayout;
