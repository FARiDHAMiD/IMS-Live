import Nav from "../../Components/Nav";
import LoginForm from "../../Components/Auth/LoginForm";
import { ToastContainer } from "react-toastify";
import "./signin.css";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  let { user } = useContext(AuthContext);
  let navigate = useNavigate();
  let goHome = () => {
    if (user) {
      navigate(`/profile/${user.user_id}`);
    }
  };
  useEffect(() => {
    goHome();
  });
  return (
    <>
      <Nav />
      <LoginForm />
      <ToastContainer className={"text-center"} />
    </>
  );
};

export default LoginPage;
