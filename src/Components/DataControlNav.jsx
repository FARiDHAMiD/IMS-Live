import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";

const DataControlNav = () => {
  let { theme } = useTheme();
  const linkClass = ({ isActive }) => isActive && "active";
  const controlData = [
    { url: "control/stock", label: "المخازن" },
    { url: "control/item", label: "الأصناف" },
    { url: "control/account", label: "الحسابات" },
  ];
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav className="navbar navbar-expand-lg d-flex justify-content-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#datacontrolNavbarNav"
            aria-controls="datacontrolNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{fontSize:'small'}}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="datacontrolNavbarNav">
            <ul className="nav nav-pills d-flex justify-content-center">
              {controlData.map((data) => (
                <li key={data.url} className={`nav-item`}>
                  <NavLink
                    to={data.url}
                    className={`nav-link mt-2 ${linkClass} ${
                      theme == "dark"
                        ? "text-light btn btn-outline-primary"
                        : ""
                    }`}
                    style={{ fontSize: "medium" }}
                  >
                    {data.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DataControlNav;
