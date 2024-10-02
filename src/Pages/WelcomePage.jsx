import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";

const WelcomePage = () => {
  let { user } = useContext(AuthContext);
  const { theme } = useTheme();
  return (
    <>
      <div className="container d-flex justify-content-center">
        <div className="py-3 text-center">
          {/* <h1 className="text-info">بسم الله الرحمن الرحيم</h1> */}
          <h2 className={theme == "dark" ? `text-info` : "text-navy"}>
            نظام إدارة المخازن - LIVE
          </h2>
          {/* <h2>Sales Management System</h2> */}
          <strong>
            <p style={{ fontSize: "large" }}>
              لايڤ هو نظام متكامل لإدارة المؤسسات والشركات للتحكم فى كل ما يتعلق
              بحركات المخازن / رصيد المستخدمين / بيانات العملاء من خلال مراقبة
              مستويات المخزون بشكل دقيق و تحديد الطلب على المواد وضمان توافرها
              في الوقت المحدد مما يؤثر بشكل مباشر على كفاءة العمل وتحقيق التوازن
              في المخزون ولضمان سلاسة سير العمل والسيطرة على التكاليف.{" "}
              <Link to={`/systeminfo`} className="btn btn-sm btn-outline mt-">
                مزيد من المعلومات
              </Link>
            </p>
          </strong>
          <div className="row">
            <div>
              <div>
                {user ? (
                  <Link
                    to={`/profile/${user.user_id}/`}
                    className={`btn ${
                      theme == "dark"
                        ? `btn-outline-light`
                        : `btn-outline-primary`
                    } btn-lg animate__animated animate__zoomInRight animate__slower m-1 col-md-3 col-lg-3 col-sm-5`}
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Welcome, {user.username}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`btn ${
                      theme == "dark"
                        ? `btn-outline-light`
                        : `btn-outline-primary`
                    } btn-lg animate__animated animate__zoomInRight animate__slower m-1 col-md-3 col-lg-3 col-sm-5`}
                    style={{ fontSize: "x-large", fontWeight: "bold" }}
                  >
                    Already Member
                  </Link>
                )}
                <Link
                  to="/working"
                  className={`btn ${
                    theme == "dark" ? `btn-light` : `btn-primary`
                  } btn-lg animate__animated animate__zoomInLeft animate__slower m-1 col-md-3 col-lg-3 col-sm-5`}
                  style={{ fontSize: "x-large", fontWeight: "bold" }}
                >
                  {user ? "Upgrade to Pro" : "Order Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
