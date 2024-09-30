import { NavLink } from "react-router-dom";
const DataControlNav = () => {
  const linkClass = ({ isActive }) => isActive && "active";
  const controlData = [
    { url: "control/stock", label: "المخازن" },
    { url: "control/item", label: "الأصناف" },
    { url: "control/account", label: "الحسابات" },
  ];
  return (
    <>
      <div className="container">
        <nav className="navbar navbar-expand-lg justify-content-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#datacontrolNavbarNav"
            aria-controls="datacontrolNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="datacontrolNavbarNav"
          >
            <ul className="nav nav-pills">
              {controlData.map((data) => (
                <li key={data.url} className={`nav-item`}>
                  <NavLink
                    to={data.url}
                    className={`nav-link ${linkClass} text-light btn btn-outline-primary`}
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
