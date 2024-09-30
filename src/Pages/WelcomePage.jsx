import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const WelcomePage = () => {
  let { user } = useContext(AuthContext);
  return (
    <>
      <div className="container d-flex justify-content-center">
        <div className="py-3 text-center">
          {/* <h1 className="text-info">بسم الله الرحمن الرحيم</h1> */}
          <h2 className="text-info">نظام إدارة المبيعات - LIVE</h2>
          {/* <h2>Sales Management System</h2> */}
          <p className="lead" style={{ fontSize: "large" }}>
            برنامج إدارة المبيعات والمشتريات والمخازن هو نظام متكامل مصمم
            لمساعدة الشركات والمؤسسات في تنظيم وإدارة العمليات المتعلقة
            بالمبيعات والمشتريات وإدارة المخازن. يهدف هذا البرنامج إلى تحسين
            الكفاءة والفعالية في هذه العمليات وتوفير الوقت والجهد.
          </p>
          <div className="row">
            <div>
              {user ? (
                <>
                  <Link
                    to={`/profile/${user.user_id}/`}
                    className="btn btn-outline-info btn-lg animate__animated animate__zoomInRight animate__slower m-1 col-md-3 col-lg-3 col-sm-3"
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Welcome, {user.username}
                  </Link>
                  <Link
                    to="/working"
                    className="btn btn-light btn-lg animate__animated animate__zoomInLeft animate__slower m-1 col-md-3 col-lg-3 col-sm-3"
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Order Now
                  </Link>
                </>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-lg animate__animated animate__zoomInRight animate__slower m-1 col-md-3 col-lg-3 col-sm-3"
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Already Member
                  </Link>
                  <Link
                    to="/working"
                    className="btn btn-light btn-lg animate__animated animate__zoomInLeft animate__slower m-1 col-md-3 col-lg-3 col-sm-3"
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Order Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
