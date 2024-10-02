import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCheck } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeProvider";

const CreateUser = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  const [is_super, setIs_super] = useState(false);
  const [staff, setStaff] = useState(false);
  const [active, setActive] = useState(true);
  let navigate = useNavigate();

  // manage controlled and uncontrolled data
  const defaultValues = {
    username: "",
    password: "",
    password2: "",
    is_superuser: false,
    is_staff: false,
    is_active: "",
    date_joined: "",
    profile: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  // checkbox handleChange true, false
  const handleSuperuserChange = (e) => {
    e.persist();
    setIs_super((prevState) => !prevState);
  };

  // checkbox handleChange true, false
  const handleStaffChange = (e) => {
    e.persist();
    setStaff((prevState) => !prevState);
  };

  // checkbox handleChange true, false
  const handleActiveChange = (e) => {
    e.persist();
    setActive((prevState) => !prevState);
  };

  const create = (data) => {
    AxiosInstance.post(`user/`, {
      profile: {
        user: data.username,
        address: "new cairo",
        created_by: user.user_id,
      },
      username: data.username,
      password: data.password,
      password2: data.password2,
      is_superuser: data.is_superuser,
      is_staff: data.is_staff,
      is_active: data.is_active,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تسجيل مستخدم جديد بنجاح`);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
        navigate(`/control/user`);
      })
      .catch((error) => {
        if (error.response["data"]["username"]) {
          toast.error(`خطأ بالتسجيل -` + error.response["data"]["username"]);
        } else {
          toast.error(`خطأ بالتسجيل -` + error.response["data"]["password"]);
        }
      });
  };

  return (
    <>
      <div className="container mt-2">
        <div className="modal-dialog" role="document">
          <div className="modal-content rounded-4 shadow">
            <div className="p-3 pb-4 border-bottom-0 text-center">
              <h1
                className={`fw-bold mb-0 fs-2 ${
                  theme == "dark" ? "text-green" : "text-navy"
                }`}
              >
                تسجيل مستخدم لأول مرة <FaUserCheck size={40} />
              </h1>
            </div>
            <div className="modal-body p-5 pt-0">
              <form>
                <div className="row">
                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="username"
                    >
                      إسم المستخدم <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.username && "is-invalid"
                      }`}
                      id="username"
                      name="username"
                      {...register("username", {
                        required: "حقل مطلوب",
                        maxLength: {
                          value: 60,
                          message: "أقصى حد 60 حرف",
                        },
                      })}
                    />
                    {errors.username && (
                      <div role="alert" className="text-danger">
                        {errors.username.message}
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="password"
                    >
                      كلمة المرور <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.password && "is-invalid"
                      }`}
                      id="password"
                      name="password"
                      {...register("password", {
                        required: "حقل مطلوب",
                        maxLength: {
                          value: 60,
                          message: "أقصى حد 60 حرف",
                        },
                      })}
                    />
                    {errors.password && (
                      <div role="alert" className="text-danger">
                        {errors.password.message}
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="password2"
                    >
                      تأكيد كلمة المرور <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.password2 && "is-invalid"
                      }`}
                      id="password2"
                      name="password2"
                      {...register("password2", {
                        required: "حقل مطلوب",
                        maxLength: {
                          value: 60,
                          message: "أقصى حد 60 حرف",
                        },
                      })}
                    />
                    {errors.password2 && (
                      <div role="alert" className="text-danger">
                        {errors.password2.message}
                      </div>
                    )}
                  </div>
                  <hr className="mt-2" />
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_superuser"
                        checked={is_super}
                        onClick={handleSuperuserChange}
                        {...register("is_superuser")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is_superuser"
                      >
                        Is Superuser
                      </label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_staff"
                        checked={staff}
                        onClick={handleStaffChange}
                        {...register("is_staff")}
                      />
                      <label className="form-check-label" htmlFor="is_staff">
                        Is Staff
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_active"
                        checked={active}
                        onClick={handleActiveChange}
                        {...register("is_active")}
                      />
                      <label className="form-check-label" htmlFor="is_active">
                        Is Active
                      </label>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={handleSubmit(create)}
                      className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-primary"
                      type="submit"
                    >
                      حفظ
                    </button>
                    <button
                      className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-secondary"
                      type="reset"
                    >
                      إعادة
                    </button>
                  </div>
                  <small className="text-muted">
                    هذا الإجراء يتم على مسئولية المستخدم الحالى للنظام .
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
