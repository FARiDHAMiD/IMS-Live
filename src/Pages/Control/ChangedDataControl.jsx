import { useContext } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ChangedDataControl = () => {
  let { user } = useContext(AuthContext);
  return (
    <>
      <div className="container card card-body text-center d-flex align-items-center">
        <FaTriangleExclamation
          size={60}
          style={{ color: "yellow", fontSize: "xx-large" }}
        />
        <h5>
          التعديل فى هذه البيانات على مسئولية المستخدم الحالى{" "}
          <Link
            to={`/profile/${user.user_id}/`}
            className="text-info"
            style={{ textDecoration: "none" }}
          >
            {user.username}
          </Link>{" "}
          , يتم تسجيل / تعديل البيانات لأول مرة طبقاً لصلاحيات المستخدم بالنظام
          .
        </h5>
        <Link className="btn btn-outline-light mt-2" to={`/working`}>
          تعليمات التسجيل
        </Link>
      </div>
    </>
  );
};

export default ChangedDataControl;
