import { FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-6 mt-2">
        {/* work on admin ticket  */}
        <Link to={-1} style={{ textDecoration: "none" }}>
          <div className="card p-3" style={{ alignItems: "center" }}>
            <FaTriangleExclamation
              size={80}
              style={{ alignContent: "center" }}
              className="text-warning"
            />
            <h3 className="mt-2">Page Not Found 404</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
