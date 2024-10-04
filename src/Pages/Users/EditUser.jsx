import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../Components/AxiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal";
import { useTheme } from "../../context/ThemeProvider";

const EditUser = () => {
  let { user, logoutUser } = useContext(AuthContext);
  let { theme } = useTheme();
  const { id } = useParams();
  let [updatedUser, setUpdatedUser] = useState([]);
  let [profile, setProfile] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // retrieve user by id
  let getUpdatedUser = async () => {
    let response = await AxiosInstance.get(`user/${id}/`);
    setValue("username", response.data.username);
    setValue("is_superuser", response.data.is_superuser);
    setValue("is_staff", response.data.is_staff);
    setValue("is_active", response.data.is_active);
    setValue("password", response.data.password);
    setValue("credit", response.data.profile.credit);
    setLoading(false);
    setUpdatedUser(response.data);
    setProfile(response.data.profile);
  };

  // manage controlled and uncontrolled data
  const defaultValues = {
    username: "",
    is_superuser: "",
    is_staff: "",
    is_active: "",
    profile: "",
    // password: updatedUser.password,
    // password2: updatedUser.password,
  };

  // Use Form hook
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    getUpdatedUser();
  }, []);

  const update = (data) => {
    AxiosInstance.put(`user/${id}/`, {
      username: data.username,
      is_superuser: data.is_superuser,
      is_staff: data.is_staff,
      is_active: data.is_active,
      // password: data.password,
      // password2: data.password,
      profile: updatedUser.profile,
    })
      .then((res) => {
        AxiosInstance.put(`profile/${profile.id}/`, {
          credit: data.credit,
        });
        if (res.status === 200) {
          toast.success(`تم تعديل المستخدم بنجاح`);
          navigate("/control/user");
        } else {
          toast.error(`خطأ بالتعديل`);
        }
      })
      .catch((e) => {
        toast.error(`خطأ بالتسجيل ` + e.response.data["username"]);
      });
  };

  // delete user
  const destroy = async () => {
    if (confirm("تأكيد الحذف")) {
      let res = await AxiosInstance.delete(`user/${id}/`);
      if (res.status == 204) {
        toast.success(`تم حذف المستخدم بنجاح`);
      } else {
        toast.error(`خطأ أثناء الحذف`);
      }
      navigate("/control/user");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container my-2">
          <form className="row">
            {/* password and password 2 hidden for update */}
            {/* <input
              type="hidden"
              className="form-control"
              id="password"
              name="password"
              defaultValue={updatedUser.password}
              {...register("password")}
            />
            <input
              type="hidden"
              className="form-control"
              id="password2"
              name="password2"
              defaultValue={updatedUser.password}
              {...register("password2")}
            /> */}

            <div className="form-group col-md-4 mb-2">
              <label
                className={theme == "dark" ? "text-warning" : "text-navy"}
                htmlFor="username"
              >
                إسم المستخدم <span className="text-danger">*</span>{" "}
              </label>
              <input
                type="text"
                className={`form-control form-control-lg rounded-3 mt-1 ${
                  errors.name && "is-invalid"
                }`}
                id="username"
                name="username"
                {...register("username", {
                  max: {
                    required: "حقل مطلوب",
                    value: 50,
                    message: "أقصى حد 50 حرف",
                  },
                })}
              />
              {errors.username && (
                <div role="alert" className="text-danger">
                  {errors.username.message}
                </div>
              )}
            </div>

            <div className="form-group col-md-4 mb-2">
              <label
                htmlFor="credit"
                className={theme == "dark" ? "text-warning" : "text-navy"}
              >
                الرصيد EGP
              </label>
              <input
                type="text"
                className={`form-control form-control-lg rounded-3 mt-1 ${
                  errors.name && "is-invalid"
                }`}
                id="credit"
                name="credit"
                {...register("credit")}
              />
              {/* <Link
                to={`/profile/${updatedUser.profile}`}
                className="btn btn-lg btn-outline-warning mt-4"
              >
                <div htmlFor="profile">{updatedUser.profile.credit}</div>
              </Link> */}
            </div>

            <div className="form-group col-md-4 mb-2">
              <label id="empty"></label>

              <Link
                to={`/userInvoices/${updatedUser.id}`}
                className={`form-control form-control-lg text-center rounded-3 mt-1`}
                style={{ textDecoration: "none" }}
              >
                فواتير المستخدم
              </Link>
              {/* <Link
                to={`/profile/${updatedUser.profile}`}
                className="btn btn-lg btn-outline-warning mt-4"
              >
                <div htmlFor="profile">{updatedUser.profile.credit}</div>
              </Link> */}
            </div>

            <hr className="mt-2" />
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_superuser"
                  {...register("is_superuser")}
                />
                <label className="form-check-label" htmlFor="is_superuser">
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
                onClick={handleSubmit(update)}
                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-primary"
                type="submit"
              >
                حفظ
              </button>
              <button
                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-danger"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#confirmDeleteModal"
              >
                حذف
              </button>
            </div>
            <small className="text-muted">
              هذا الإجراء يتم على مسئولية المستخدم الحالى للنظام .
            </small>
          </form>
        </div>
      )}
      <ConfirmDeleteModal
        object={updatedUser.username}
        destroy={destroy}
        label={"مستخدم"}
      />
    </>
  );
};

export default EditUser;
