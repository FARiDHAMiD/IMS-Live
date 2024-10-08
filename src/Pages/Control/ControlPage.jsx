import { Link } from "react-router-dom";
import {
  FaDatabase,
  FaFolderClosed,
  FaServer,
  FaUserCheck,
  FaVault,
} from "react-icons/fa6";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

const ControlPage = () => {
  let { user } = useContext(AuthContext);

  // clear JWT to logout user automatically later
  useEffect(() => {
    // localStorage.clear();
  }, []);

  return (
    <div className="container mt-3">
      <div className="row d-flex justify-content-center">
        <div className="col-md-6 mt-2">
          <Link to="/control/basicControl" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaServer size={80} style={{ alignContent: "center" }} />
              <h3 className="mt-2">البيانات الأساسية للنظام</h3>
            </div>
          </Link>
        </div>

        {user.is_superuser && (
          <>
            <div className="col-md-6 mt-2">
              <Link to="/control/user" style={{ textDecoration: "none" }}>
                <div className="card p-3" style={{ alignItems: "center" }}>
                  <FaUserCheck size={80} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">مستخدمين النظام</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-6 mt-2">
              <Link to="/control/treausry" style={{ textDecoration: "none" }}>
                <div className="card p-3" style={{ alignItems: "center" }}>
                  <FaVault size={80} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">الخزنة الرئيسية</h3>
                </div>
              </Link>
            </div>
          </>
        )}
        <div className="col-md-6 mt-2">
          <Link to="/control/changedControl" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaDatabase size={80} style={{ alignContent: "center" }} />
              <h3 className="mt-2">المخازن / الأصناف / العملاء</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-6 mt-2">
          <Link to="/control/archive" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaFolderClosed size={80} style={{ alignContent: "center" }} />
              <h3 className="mt-2">البيانات المعطلة (الأرشيف)</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ControlPage;
