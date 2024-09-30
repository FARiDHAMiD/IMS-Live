import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  FaFileInvoiceDollar,
  FaGear,
  FaHouse,
  FaUserLarge,
  FaUsers,
} from "react-icons/fa6";

import AuthContext from "../context/AuthContext";
import { BiSolidReport, BiStore } from "react-icons/bi";

import { BsBagFill } from "react-icons/bs";

const Nav = () => {
  const { pathname } = useLocation();
  const [collapse, setCollapse] = useState("");

  useEffect(() => {
    setCollapse("collapse");
  }, [pathname]);

  const changeCollapseState = () => {
    setCollapse("");
  };

  let { user } = useContext(AuthContext);
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary justify-content-center">
      <div className="container-fluid text-center">
        <NavLink className="navbar-brand" to="/" onClick={changeCollapseState}>
          <FaHouse size={30} />
          <p style={{ marginBottom: "auto" }}>الرئيسية</p>
        </NavLink>
        <button
          className="navbar-toggler"
          to="#"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`${collapse} navbar-collapse`}
          style={
            !user ? { justifyContent: "left" } : { justifyContent: "center" }
          }
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/invoice"
                    className={linkClass}
                    onClick={changeCollapseState}
                  >
                    <FaFileInvoiceDollar size={30} />
                    <h4>
                      الفواتير{" "}
                      <span
                        className="badge bg-secondary"
                        style={{ fontSize: "small" }}
                      ></span>
                    </h4>
                  </NavLink>
                </li>

                {user && (user.is_staff || user.is_superuser) && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/stocks"
                        className={linkClass}
                        onClick={changeCollapseState}
                      >
                        <BiStore size={30} />
                        <h4>المخازن</h4>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/items"
                        className={linkClass}
                        onClick={changeCollapseState}
                      >
                        <BsBagFill size={30} />
                        <h4>الأصناف</h4>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/accounts"
                        className={linkClass}
                        onClick={changeCollapseState}
                      >
                        <FaUsers size={30} />
                        <h4>العملاء</h4>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/reports"
                        className={linkClass}
                        onClick={changeCollapseState}
                      >
                        <BiSolidReport size={30} />
                        <h4>التقارير</h4>
                      </NavLink>
                    </li>
                    {user.is_superuser && (
                      <li className="nav-item">
                        <NavLink
                          to="/control"
                          className={linkClass}
                          onClick={changeCollapseState}
                        >
                          <FaGear size={30} />
                          <h4>التحكم</h4>
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
                {/* {user && user.is_superuser && (
                  <li className="nav-item">
                    <NavLink
                      to="/admin"
                      className={linkClass}
                      onClick={changeCollapseState}
                    >
                      <FaSuperpowers size={30} />
                      <h4>Admin</h4>
                    </NavLink>
                  </li>
                )} */}
              </>
            )}
            {user ? (
              <li className="nav-item">
                <NavLink
                  to={`/profile/${user.user_id}`}
                  className={linkClass}
                  onClick={changeCollapseState}
                >
                  <FaUserLarge size={30} />
                  <h4>{user.username}</h4>
                </NavLink>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={changeCollapseState}
                >
                  <FaUserLarge size={30} />
                  <h4>Login</h4>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
