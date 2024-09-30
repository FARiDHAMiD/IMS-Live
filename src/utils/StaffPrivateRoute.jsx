import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Unauthorized from "../Pages/StatusCodes/Unauthorized";
import AuthContext from "../context/AuthContext";

const StaffPrivateRoute = () => {
  let { user } = useContext(AuthContext);
  if (user) {
    return user.is_superuser || user.is_staff ? <Outlet /> : <Unauthorized />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default StaffPrivateRoute;
