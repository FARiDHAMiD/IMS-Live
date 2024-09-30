import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
const LoginForm = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <>
      <main className="form-signin w-100 m-auto text-center">
        <form onSubmit={loginUser}>
          <FaLock size={50} />
          <h1 className="h3 mb-3 fw-normal mt-3">تسجيل الدخول</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="إسم المستخدم"
              name="username"
            />
            <label htmlFor="floatingInput">إسم المستخدم</label>
          </div>
          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="password"
            />
            <label htmlFor="floatingPassword">كلمة المرور</label>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> تذكر بيانات الدخول
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            تأكيد
          </button>
          <p className="mt-4 mb-3 text-muted">
            <Link
              className="btn btn-outline-dark"
              target="_blank"
              to="/register"
            >
              <span>طلب مستخدم</span>
            </Link>
            <a target="_blank" href="https://www.linkedin.com/in/farid-7amid">
              <span>الدعم الفنى</span>
            </a>
          </p>
        </form>
      </main>
    </>
  );
};

export default LoginForm;
